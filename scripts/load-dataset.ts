import { S3Client, ListObjectsV2Command, ListObjectsV2CommandInput, _Object } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import { program } from "commander";
import { LANGUAGES, LanguageCode } from '@/utils/languages';

// Configure logging
const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
  warning: (msg: string) => console.warn(`[WARN] ${msg}`)
};

// Environment variables and constants
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY;
const R2_SECRET_KEY = process.env.R2_SECRET_KEY;
const DATASET_BUCKET = "mizu-cmc";

const prisma = new PrismaClient();

// S3 Client configuration
const s3Client = new S3Client({
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY!,
    secretAccessKey: R2_SECRET_KEY!
  },
  region: 'auto' // Cloudflare R2 uses 'auto'
});

async function* listR2Objects(datasetId: number, prefix: string, startAfter: string = "") {
  let processed = 0;
  let errors = 0;

  try {
    const input: ListObjectsV2CommandInput = {
      Bucket: DATASET_BUCKET,
      Prefix: prefix,
      StartAfter: startAfter
    };

    let isTruncated = true;
    let continuationToken: string | undefined;

    while (isTruncated) {
      if (continuationToken) {
        input.ContinuationToken = continuationToken;
      }

      const command = new ListObjectsV2Command(input);
      const response = await s3Client.send(command);

      if (!response.Contents) {
        logger.warning(`No contents found for prefix: ${prefix}`);
        break;
      }

      const records = response.Contents.map((obj: _Object) => ({
        dataset_id: datasetId,
        md5: obj.Key!.split('/')[3].replace('.zz', ''),
        byte_size: obj.Size || 0
      }));

      processed += records.length;
      errors += records.length - records.length; // Calculate actual errors if needed

      const lastMd5 = records[records.length - 1]?.md5 || '';
      logger.info(
        `Processed batch of ${records.length} objects for ${prefix}. ` +
        `Total: ${processed}, Errors: ${errors}, Last md5: ${lastMd5}`
      );

      yield records;

      isTruncated = response.IsTruncated || false;
      continuationToken = response.NextContinuationToken;
    }

    logger.info(`Completed listing objects for ${prefix}. Total processed: ${processed}, Errors: ${errors}`);
  } catch (error) {
    logger.error(`Error listing objects for ${prefix} from R2: ${error}`);
  }
}

async function loadDatasetForLanguage(
  name: string,
  dataType: string,
  language: string,
  lastProcessedMd5: string
) {
  try {
    let totalProcessed = 0;
    const prefix = `${name}/${dataType}/${language}`;

    // Get dataset ID
    const dataset = await prisma.datasets.findFirstOrThrow({
      where: {
        name,
        data_type: dataType,
        language
      }
    });

    const startAfter = `${prefix}/${lastProcessedMd5}.zz`;
    logger.info(
      `Starting dataset load for ${prefix} with dataset id ${dataset.id} and start after ${startAfter}`
    );

    for await (const batchMetadata of listR2Objects(dataset.id, prefix, startAfter)) {
      // Batch insert records
      await prisma.data_records.createMany({
        data: batchMetadata.map(record => ({
          dataset_id: record.dataset_id,
          md5: record.md5,
          byte_size: record.byte_size,
          source: prefix,
          num_of_records: 0,
          decompressed_byte_size: 0
        })),
        skipDuplicates: true
      });

      totalProcessed += batchMetadata.length;
      logger.info(`Total processed for ${language}: ${totalProcessed}`);
    }

    logger.info(`Completed loading dataset ${prefix}. Total processed: ${totalProcessed}`);
  } catch (error) {
    logger.error(`Error processing language ${language}: ${error}`);
  }
}

async function loadDataset(dataset: string, dataType: string) {
  logger.info(`Loading dataset ${dataset} with data type ${dataType}`);
  try {
    const tasks = Object.entries(LANGUAGES)
      .filter(([_, config]) => Boolean(config.lastProcessed))
      .map(([lang, config]) => 
        loadDatasetForLanguage(dataset, dataType, lang, config.lastProcessed!)
      );

    await Promise.all(tasks);
    logger.info(`Completed loading all languages for ${dataset}/${dataType}`);
  } catch (error) {
    logger.error(`Error loading dataset: ${error}`);
    process.exit(1);
  }
}

// Command line interface setup
program
  .option('--name <name>', 'Name of the dataset')
  .option('--data-type <type>', 'Type of the dataset', 'text')
  .parse(process.argv);

const options = program.opts();

if (!options.name) {
  console.error('Dataset name is required');
  process.exit(1);
}

// Run the script
loadDataset(options.name, options.dataType)
  .catch(error => {
    logger.error(`Fatal error: ${error}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
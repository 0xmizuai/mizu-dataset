// READ ME
// This script is used to sync the database from staging to production
// ts-node --compilerOptions '{"module":"CommonJS"}'\
//      scripts/db-sync.ts\
//      --source=$SRR_POSTGRES_URL\
//      --dest=$DST_POSTGRES_URL

import { PrismaClient } from "@prisma/client";

// Parse named command line arguments
const args = process.argv.slice(2).reduce(
  (acc, arg) => {
    if (arg.startsWith("--source=")) {
      acc.source = arg.replace("--source=", "");
    } else if (arg.startsWith("--dest=")) {
      acc.dest = arg.replace("--dest=", "");
    }
    return acc;
  },
  { source: "", dest: "" }
);

if (!args.source || !args.dest) {
  console.error(
    "Usage: ts-node scripts/db-sync.ts --source=<source_url> --dest=<destination_url>"
  );
  process.exit(1);
}

const sourcePrisma = new PrismaClient({
  datasources: {
    db: {
      url: args.source,
    },
  },
});

const targetPrisma = new PrismaClient({
  datasources: {
    db: {
      url: args.dest,
    },
  },
});

async function sync_datasets() {
  console.log("Syncing datasets...");
  let skip = 0;
  const take = 1000; // Process 1000 datasets at a time

  while (true) {
    const sourceData = await sourcePrisma.datasets.findMany({
      skip,
      take,
    });

    if (sourceData.length === 0) break;

    for (const record of sourceData) {
      await targetPrisma.datasets.upsert({
        where: { id: record.id },
        create: record,
        update: record,
      });
    }

    skip += take;
    console.log(`Processed ${skip} datasets...`);
  }
  console.log("Datasets sync completed!");
}

async function sync_data_records(max_records: number = 10000) {
  console.log("Syncing data_records...");

  // Get all dataset IDs first
  const datasets = await sourcePrisma.datasets.findMany({
    select: { id: true },
  });

  for (const dataset of datasets) {
    console.log(`Processing data_records for dataset ${dataset.id}...`);
    let skip = 0;
    const take = 1000; // Process 1000 records at a time
    let totalRecords = 0;

    while (totalRecords < max_records) {
      const sourceData = await sourcePrisma.data_records.findMany({
        where: { dataset_id: dataset.id },
        skip,
        take,
      });

      if (sourceData.length === 0) break;

      for (const record of sourceData) {
        await targetPrisma.data_records.upsert({
          where: { id: record.id },
          create: record,
          update: record,
        });
      }

      totalRecords += sourceData.length;
      skip += take;
      console.log(
        `Processed ${totalRecords} records for dataset ${dataset.id}...`
      );
    }

    if (totalRecords >= max_records) {
      console.log(`Reached ${max_records} limit for dataset ${dataset.id}`);
    }
  }
  console.log("Data records sync completed!");
}

async function main() {
  try {
    console.log("Starting database sync...");

    // Verify connections
    console.log("Verifying database connections...");
    await sourcePrisma.$connect();
    await targetPrisma.$connect();

    await sync_datasets();
    await sync_data_records();

    console.log("Database sync completed successfully!");
  } catch (error) {
    console.error("Error during database sync:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await sourcePrisma.$disconnect();
    await targetPrisma.$disconnect();
  });

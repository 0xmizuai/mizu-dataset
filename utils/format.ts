export const formatBytes = (bytes: number) => {
  if (bytes >= 1_000_000_000_000) {
    return (bytes / 1_000_000_000_000).toFixed(2) + "TB"; // TB
  } else if (bytes >= 1_000_000_000) {
    return (bytes / 1_000_000_000).toFixed(2) + "GB"; // GB
  } else if (bytes >= 1_000_000) {
    return (bytes / 1_000_000).toFixed(2) + "MB"; // MB
  } else if (bytes >= 1_000) {
    return (bytes / 1_000).toFixed(2) + "KB"; // KB
  } else {
    return bytes + "B"; // 字节数
  }
};
export const formatObjects = (num: number) => {
  if (num >= 1_000_000_000_000) {
    return (num / 1_000_000_000_000).toFixed(2) + "TN"; // trillion
  } else if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + "BN"; // billion
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + "M"; // million
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(2) + "K"; // thousand
  } else {
    return num.toString(); // less than thousand
  }
};

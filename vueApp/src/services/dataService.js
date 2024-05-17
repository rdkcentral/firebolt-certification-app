import axios from 'axios';

const getCatalogData = async () => {
  const res = await axios.get(
    `https://api.github.com/repos/rdkcentral/firebolt-certification-app/contents/?ref=github-io-deployment`,
  );
  const { data } = res;
  return data;
};

const filterCatalogData = (dataArr) => {
  // Step 1: Filter items of type 'dir' and exclude 'dist'
  const buildDirs = dataArr.filter((item) => item.type === 'dir' && item.name !== 'dist');

  // Step 2: Initialize arrays for different categories
  const standardBuilds = [];
  const prBuilds = [];
  const tagBuilds = [];

  // Step 3: Separate items into different arrays based on their names
  buildDirs.forEach((item) => {
    if (item.name.startsWith('PR-')) {
      prBuilds.push(item.name);
    } else if (item.name.startsWith('Tag-')) {
      tagBuilds.push(item.name);
    } else if (item.name === 'prod' || item.name === 'edge') {
      standardBuilds.push(item.name);
    }
  });

  return {
    standardBuilds,
    prBuilds,
    tagBuilds,
  };
};

export { getCatalogData, filterCatalogData };

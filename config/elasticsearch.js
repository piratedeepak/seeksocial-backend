import { Client } from "@elastic/elasticsearch";

const getElasticClient = () => {
  return new Promise((resolve, reject) => {
    try {
      const client = new Client({
        cloud: { id: process.env.ELASTICSEARCH_CLOUD_ID },
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD,
        },
      });
      resolve(client);
    } catch (error) {
      console.log("ERROR: Elasticsearch connecting =>", error.message);
      reject(error);
    }
  });
};

export default getElasticClient;

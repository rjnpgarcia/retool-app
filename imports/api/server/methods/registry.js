import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { MongoClient } from "mongodb";
import { QUERY, SOURCE } from "../../classes/common/const";
import { Random } from "meteor/random";
import { productsCollection } from "../../DB";
import { toIndexField } from "../../classes/common/functions";

if (Meteor.isServer) {
  let db = null;
  Meteor.methods({
    [SOURCE.GET]: async function (data) {
      const connectionString = data.sourceUrl;
      const databaseName = data.dbName;
      //   const userId = data.userId
      console.log(connectionString);
      try {
        const client = await MongoClient.connect(connectionString, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        });

        db = client.db(databaseName);

        const collectionRetrieved = await db.listCollections().toArray();
        const collectionNames = collectionRetrieved.map(
          (collection) => collection.name
        );

        // for (const collection of collectionRetrieved) {
        //   const collectionName = collection.name;
        //   const collectionData = await db
        //     .collection(collectionName)
        //     .find()
        //     .toArray();

        //   for (const document of collectionData) {
        //     if (!document.hasOwnProperty("index1")) {
        //       const firstProperty = Object.keys(document)[1];
        //       document.index1 = toIndexField([
        //         { value: document[firstProperty], hash: true },
        //       ]);

        //       // Update the document in the collection
        //       await db
        //         .collection(collectionName)
        //         .updateOne(
        //           { _id: document._id },
        //           { $set: { index1: document.index1 } }
        //         );
        //     }
        //   }

        //   // Check if the index1 field already exists in the collection
        //   const indexExists = await db
        //     .collection(collectionName)
        //     .indexExists("index1");
        //   if (!indexExists) {
        //     // Create an ascending index on index1 field
        //     await db.collection(collectionName).createIndex({ index1: 1 });
        //   }
        // }
        // const collectionsData = {};

        // for (const collection of collectionRetrieved) {
        //   const collectionName = collection.name;
        //   const data = await db.collection(collectionName).find().toArray();
        //   collectionsData[collectionName] = data;
        //   const newCollection = new Mongo.Collection(collectionName);
        //   data.forEach((document) => {
        //     document._id = new Mongo.ObjectID();
        //     document.index1 = toIndexField([
        //       { value: document._id, hash: true },
        //     ]); // Assign a new ObjectID to _id field
        //     newCollection.insert(document);
        //   });
        // }

        // client.close();

        console.log(collectionNames);
        //   console.log(collectionsData);
        return { collectionNames: collectionNames };
      } catch (err) {
        console.log(err);
      }
    },
    [SOURCE.INSERT]: async function (data) {
      console.log(data.data.collection);
      console.log(data.lastbasis);
      const dataCollection = db.collection(data.data.collection);
      const pipeline = [];
      // let match = "";
      // console.log(data.lastbasis);

      // const document = await dataCollection.findOne();
      // let firstPropertyName = "";

      // const documentKeys = Object.keys(document);
      // if (documentKeys.length > 1) {
      //   const firstProperty = documentKeys[1];
      //   if (
      //     typeof document[firstProperty] === "object" &&
      //     !Array.isArray(document[firstProperty])
      //   ) {
      //     const nestedKeys = Object.keys(document[firstProperty]);
      //     if (nestedKeys.length > 0) {
      //       const nestedProperty = nestedKeys[0];
      //       firstPropertyName = `${firstProperty}.${nestedProperty}`;
      //     } else {
      //       firstPropertyName = firstProperty;
      //     }
      //   } else {
      //     firstPropertyName = firstProperty;
      //   }
      // }
      // console.log(firstPropertyName);

      if (data.lastbasis) {
        match = {
          $match: { index1: { $gt: data.lastbasis } },
        };
      } else {
        match = {
          $match: { index1: { $gt: "" } },
        };
      }

      console.log(match);
      pipeline.push(match);

      pipeline.push({ $limit: 5 });
      return dataCollection
        .aggregate(pipeline)
        .toArray()
        .then((result) => {
          const retval = {};
          if (result && result.length) {
            retval.data = result.map((d) => ({
              ...d,
              _id: Random.id(),
            }));
            retval.lastbasis = result[result.length - 1].index1;
            return retval;
          }
        });
    },
    [QUERY.SEARCH]: async function (data) {
      console.log(data.collection);
      try {
        const dataCollection = db.collection(data.collection);
        const document = await dataCollection.findOne();

        const getFieldNames = (obj, parentKey = "") => {
          const fieldNames = [];
          for (const key in obj) {
            const fieldPath = parentKey ? `${parentKey}.${key}` : key;
            fieldNames.push(fieldPath);
            if (typeof obj[key] === "object" && obj[key] !== null) {
              if (Array.isArray(obj[key])) {
                if (obj[key].length > 0 && typeof obj[key][0] === "object") {
                  const nestedFieldNames = getFieldNames(
                    obj[key][0],
                    fieldPath
                  );
                  fieldNames.push(...nestedFieldNames);
                }
              } else {
                const nestedFieldNames = getFieldNames(obj[key], fieldPath);
                fieldNames.push(...nestedFieldNames);
              }
            }
          }
          return fieldNames;
        };

        const fieldNames = getFieldNames(document);

        console.log(fieldNames);
        return { fieldNames };
      } catch (error) {
        console.error("Error retrieving field names:", error);
      }
    },
    [QUERY.GET]: async function (data) {
      console.log(data.data.collection);
      console.log(data.lastbasis);
      const dataCollection = db.collection(data.data.collection);
      const pipeline = [];
      let match = "";
      console.log(data.lastbasis);

      // const document = await dataCollection.findOne();
      // let firstPropertyName = "";
      // let firstProperty = "";
      // let nestedProperty = "";

      // const documentKeys = Object.keys(document);
      // if (documentKeys.length > 1) {
      //   firstProperty = documentKeys[1];
      //   if (
      //     typeof document[firstProperty] === "object" &&
      //     !Array.isArray(document[firstProperty])
      //   ) {
      //     const nestedKeys = Object.keys(document[firstProperty]);
      //     if (nestedKeys.length > 0) {
      //       nestedProperty = nestedKeys[0];
      //       firstPropertyName = `${firstProperty}.${nestedProperty}`;
      //     } else {
      //       firstPropertyName = firstProperty;
      //     }
      //   } else {
      //     firstPropertyName = firstProperty;
      //   }
      // }

      console.log(`property: ${data.data.query}`);
      if (data.lastbasis) {
        match = {
          $match: { [data.data.query]: { $gt: data.lastbasis } },
        };
      } else {
        match = {
          $match: { [data.data.query]: { $gt: "" } },
        };
      }
      const sort = {
        $sort: { [data.data.query]: 1 },
      };

      const project = {
        $project: { _id: 1, [data.data.query]: 1 },
      };

      console.log(match);
      pipeline.push(match);
      pipeline.push(project);
      pipeline.push(sort);

      pipeline.push({ $limit: 5 });
      return dataCollection
        .aggregate(pipeline)
        .toArray()
        .then((result) => {
          const retval = {};
          if (result && result.length) {
            retval.data = result.map((d) => ({
              ...d,
              _id: Random.id(),
            }));

            retval.lastbasis = result[result.length - 1][data.data.query];

            console.log(retval);
            return retval;
          }
        });
    },
    [QUERY.VALUES.GET]: async function (data) {
      console.log(data.data.collection);
      console.log(data.data.property);
      console.log(data.lastbasis);
      const dataCollection = db.collection(data.data.collection);
      const pipeline = [];
      let match = "";
      console.log(data.lastbasis);

      if (data.lastbasis) {
        match = {
          $match: {
            [data.data.property]: {
              $regex: data.data.value,
              $gt: data.lastbasis,
            },
          },
        };
      } else {
        match = {
          $match: {
            [data.data.property]: { $regex: data.data.value, $gt: "" },
          },
        };
      }
      const sort = {
        $sort: { [data.data.property]: 1 },
      };

      // const project = {
      //   $project: { _id: 1, [data.data.query]: 1 },
      // };

      console.log(match);
      pipeline.push(match);
      // pipeline.push(project);
      pipeline.push(sort);

      pipeline.push({ $limit: 5 });
      return dataCollection
        .aggregate(pipeline)
        .toArray()
        .then((result) => {
          const retval = {};
          if (result && result.length) {
            retval.data = result.map((d) => ({
              ...d,
              _id: Random.id(),
            }));
            retval.lastbasis = result[result.length - 1][data.data.property];
            return retval;
          }
        });
    },
  });
}

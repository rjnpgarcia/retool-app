import crc32 from "crc32";

export function toIndexField(arr) {
  return arr
    .map((item) => {
      if (item != null) {
        if (item.hash)
          if (item.value instanceof Mongo.ObjectID)
            return crc32(item.value._str);
          else if (
            Meteor.isServer &&
            item.value instanceof MongoInternals.NpmModule.ObjectID
          )
            return crc32(item.value.toString());
          else if (typeof item.value == "string") return crc32(item.value);
          else throw new Error("Invalid to index field value=" + item.value);
        if (typeof item == "boolean") return item ? 1 : 0;
      }
      return item;
    })
    .filter((i) => i != null)
    .join("");
}

import * as _ from "radash";

const filterData = (
  sources: any[],
  params: { filterKey: string; filterValue: string }
) => {
  console.log("Limit Sources:", sources);
  let tracks = [] as any;

  if (Array.isArray(sources)) {
    // If the first source is an array of PlaylistTrackObjects, assume all sources are
    tracks = sources.flat();
  } else {
    throw new Error(
      `Invalid source type: ${typeof sources[0]} in ${
        sources[0]
      } located in sources: ${JSON.stringify(sources)}`
    );
  }

  if (Array.isArray(tracks)) {
    const res = tracks.filter((track: any) => {
      if (params.filterKey && params.filterValue) {
        const [operator, value] = params.filterValue.split(" ") as [
          string,
          string
        ];

        const trackValue = _.get(track, params.filterKey) as any;

        let type = "string";
        let filterValue: string | number | Date | boolean | object;

        if (!isNaN(Number(value))) {
          filterValue = Number(value);
          type = "number";
        } else if (!isNaN(Date.parse(value))) {
          filterValue = new Date(value);
          type = "date";
        } else {
          filterValue = value;
        }

        switch (type) {
          case "number":
            switch (operator) {
              case ">":
                return trackValue > filterValue;
              case "<":
                return trackValue < filterValue;
              case ">=":
                return trackValue >= filterValue;
              case "<=":
                return trackValue <= filterValue;
              case "==":
                return trackValue == filterValue;
              default:
                throw new Error(`Invalid operator: ${operator}`);
            }
          case "string":
            return trackValue.includes(filterValue);
          case "boolean":
            return trackValue == Boolean(filterValue);
          case "object":
            if (filterValue instanceof Date) {
              const trackDateValue = new Date(
                trackValue as number | string | Date
              );
              switch (operator) {
                case ">":
                  return trackDateValue > filterValue;
                case "<":
                  return trackDateValue < filterValue;
                case ">=":
                  return trackDateValue >= filterValue;
                case "<=":
                  return trackDateValue <= filterValue;
                case "==":
                  return trackDateValue.getTime() == filterValue.getTime();
                default:
                  throw new Error(`Invalid operator: ${operator}`);
              }
            }
          default:
            throw new Error(
              `Unsupported filterValue type: ${typeof filterValue}`
            );
        }
      }
      return true;
    });
    return res;
  } else {
    throw new Error(`Invalid source type: ${typeof tracks}`);
  }
};

export { filterData };

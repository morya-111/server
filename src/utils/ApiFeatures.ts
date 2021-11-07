import QueryParameter from "../types/QueryParameter";
import { ConfigProfile } from "typeorm-express-query-builder/profile/config-profile";
import { QueryBuilder } from "typeorm-express-query-builder";

interface Options {
  pagination?: boolean;
  ordering?: boolean;
  relations?: boolean;
  select?: boolean;
}

class ApiFeatures {
  queryString;
  builtQuery;

  constructor(
    queryString: QueryParameter,
    opt: Options = {
      ordering: true,
      pagination: true,
      relations: true,
      select: true,
    }
  ) {
    this.queryString = Object.assign({}, queryString);

    const newOpts = {
      ordering: true,
      pagination: true,
      relations: true,
      select: true,
      ...opt,
    };

    const customProfile: ConfigProfile = {
      options: {
        pagination: {
          status: newOpts.pagination ? "enabled" : "disabled",
          paginate: newOpts.pagination,
          itemsPerPage: 25,
        },
        ordering: {
          status: newOpts.ordering ? "enabled" : "disabled",
        },
        relations: {
          status: newOpts.relations ? "enabled" : "disabled",
        },
        select: {
          status: newOpts.select ? "enabled" : "disabled",
        },
      },
      policy: "skip",
    };

    const builder = new QueryBuilder(queryString, customProfile);
    this.builtQuery = builder.build();
  }

  paginationInfo = (entityCount: number) => {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 25;
    const endIndex = page * limit;

    return {
      page,
      limit,
      previousPage: page - 1 > 0 ? page - 1 : undefined,
      nextPage: endIndex < entityCount ? page + 1 : undefined,
      isPrevious: page - 1 > 0,
      isNext: endIndex < entityCount,
      pages: Math.ceil(entityCount / limit),
    };
  };
}

export default ApiFeatures;

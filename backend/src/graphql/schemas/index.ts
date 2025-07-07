import { mergeTypeDefs } from "@graphql-tools/merge";
import { temperatureTypeDefs } from "./temperature.schema";

export const typeDefs = mergeTypeDefs([temperatureTypeDefs]);

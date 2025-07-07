import { mergeResolvers } from "@graphql-tools/merge";
import { temperatureResolvers } from "./temperature.resolver";

export const resolvers = mergeResolvers([temperatureResolvers]);

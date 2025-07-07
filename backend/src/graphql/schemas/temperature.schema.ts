import { gql } from "apollo-server-express";

export const temperatureTypeDefs = gql`
  type Candlestick {
    city: String!
    hour: String!
    open: Float!
    close: Float!
    high: Float
    low: Float
  }

  type Query {
    getCandlesticks(cities: [String!]!): [Candlestick!]!
  }
`;

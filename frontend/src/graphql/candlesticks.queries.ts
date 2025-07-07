import { gql } from "@apollo/client";

export const GET_ALL_CANDLESTICKS = gql`
  query GetAllCandlesticks($cities: [String!]!) {
    getCandlesticks(cities: $cities) {
      hour
      city
      open
      close
      high
      low
    }
  }
`;

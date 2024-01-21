import ActivityFragment from "@/graphql/fragments/activity";
import gql from "graphql-tag";

const GetLatestActivities = gql`
  query GetLatestActivities($userConnected: Boolean!) {
    getLatestActivities {
      ...Activity
      isFavorite @include(if: $userConnected)
    }
  }
  ${ActivityFragment}
`;

export default GetLatestActivities;

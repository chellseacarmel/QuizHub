import useApiCall from '../../../hooks/useApiCall';
import BrowseUserCard from '../../Card/BrowseUserCard';
import { Grid } from '@mui/material';

export default function UsersResult({ searchWord, searchType }) {
  const [loading, payload, error] = useApiCall(
    process.env.NODE_ENV === 'production'
      ? `/api/consumer`
      : `http://localhost:4000/api/consumer`
  );
  if (!payload) {
    return <div>No Data</div>;
  }
  if (loading) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>error...</div>;
  }
  const consumerData = payload.createConsumer;
  // console.log(consumerData);
  const ConsumerList = consumerData
    .filter((data) => {
      if (searchWord === null) return true;

      if (searchType !== 'Username') return false;

      return data.consumerUsername
        .toUpperCase()
        .includes(searchWord.toUpperCase());
    })
    .map((data) => {
      return (
        <Grid item>
          {' '}
          <BrowseUserCard consumerData={data} />{' '}
        </Grid>
      );
    });
  return (
    <div>
      {/* TODO: add total __ result */}
      <Grid container spacing={3} justifyContent='center'>
        {ConsumerList}
      </Grid>
    </div>
  );
}
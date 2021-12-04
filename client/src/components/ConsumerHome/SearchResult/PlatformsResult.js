import useApiCall from '../../../hooks/useApiCall';
import BrowsePlatformCard from '../../Card/BrowsePlatformCard';
import { Grid, Typography } from '@mui/material';

export default function PlatformsResult({ searchWord, searchType }) {
  const [loading, payload, error] = useApiCall(
    process.env.NODE_ENV === 'production'
      ? `/api/creatorHome`
      : `http://localhost:4000/api/creatorHome`,
    { withCredentials: true }
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
  const platformData = payload.createPlatform;
  const PlatformCardList = platformData
    .filter((data) => {
      if (searchWord === null) return true;
      if (searchType !== 'Platform') return false;

      return data.platformName.toUpperCase().includes(searchWord.toUpperCase());
    })
    .map((data) => {
      return (
        <Grid item>
          {' '}
          <BrowsePlatformCard platformData={data} />{' '}
        </Grid>
      );
    }
  );

  const countResult = platformData.filter((data) => {
    if (searchWord === null) return true;
    if (searchType !== 'Platform') return false;

    return data.platformName.toUpperCase().includes(searchWord.toUpperCase());
  });

  return (
    <div>
      { countResult.length !== 0 ?
        <div>
          <Grid container justifyContent='center' sx={{ paddingBottom: '20px' }}>
            { countResult.length == 1 ?
            <Typography>{countResult.length} platform</Typography>
            :
            <Typography>{countResult.length} platforms</Typography>
            }
          </Grid>
          <Grid container spacing={3} justifyContent='center'>
            {PlatformCardList}
          </Grid>
        </div>
      :
        <Grid container justifyContent='center'>
          { searchType == 'Platform' ? 
            <Typography>No result found</Typography>
            :
            <div></div>
          }
        </Grid>
      }
    </div>
  );
}

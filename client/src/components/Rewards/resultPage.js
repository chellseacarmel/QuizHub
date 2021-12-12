import axios from 'axios';
import { Form, Row, Col, Button } from 'react-bootstrap';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { UserContext, accountSettingsContext } from '../../App';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import useApiCall from '../../hooks/useApiCall';
import { Grid, Link, Tooltip, Box, Card, Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  emphasized: {
    fontFamily: 'Nunito',
    color: '#374A59',
    fontSize: '90px',
    lineHeight: '1',
  },
  secondary: {
    fontFamily: 'Nunito',
    color: '#8992A2',
    fontSize: '30px',
    lineHeight: '1',
  },
  feedback: {
    fontFamily: 'Nunito',
    fontSize: '60px',
    lineHeight: '1',
    textAlign: 'center',
  }, 
  result: {
    fontFamily: 'Nunito',
    fontSize: '80px',
    lineHeight: '1',
    // color: '#374A59',
  },
  upper: {
    fontFamily: 'Nunito',
    color: '#374A59',
    fontSize: '30px',
    lineHeight: '1',
  },
  button: {
    minWidth: '150px',
    minHeight: '60px',
    borderRadius: '18px',
  }
});

function ResultsPage() {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const quizId = id;
  const [loading, quizResult, error] = useApiCall(
    process.env.NODE_ENV === 'production'
      ? `/api/consumer/quizHistory/${quizId}`
      : `http://localhost:4000/api/consumer/quizHistory/${quizId}`,
    { withCredentials: true }
  );
  console.log('all quizResult', quizResult);

  const currentQuizResult = location.state?.quizzes;
  console.log('current his : ', currentQuizResult);
  // console.log('consumer quiz history', payload);
  // const [result, setResult] = useState(''); // need to change this based on takes quiz
  const [leaderboardVisible, setLeaderboardVisible] = useState('');

  const certificate_qualifier = useRef(0);
  const badge_qualifier = useRef(0);

  const [correct, setCorrect] = useState(0);
  const [ques, setQues] = useState(0);
  //const quizName=useRef("")
  const [quizName, setQuizName] = useState('');
  const [trialLimit, setTrialLimit] = useState(0);
  const [reward, setReward] = useState('');
  const certificate_id = useRef('');

  const { user, dispatch } = useContext(UserContext);
  const email = useRef('');
  const credential_id = useRef('');
  //const file_download=useRef("")
  const [file_download, setFile] = useState('');
  const [img, setImage] = useState('');

  const image = useRef('');

  // if (!quizResult) {
  //   return <div>No Data</div>;
  // }
  // if (loading) {
  //   return <div>loading...</div>;
  // }
  // if (error) {
  //   return <div>error...</div>;
  // }

  const getQuizInfo = async () => {
    try {
      const response = await axios.get(
        process.env.NODE_ENV == 'production'
          ? `/api/quiz/detail/${quizId}`
          : `http://localhost:4000/api/quiz/detail/${quizId}`
      );
      const userInfo = await axios.get(
        process.env.NODE_ENV === 'production'
          ? `/api/auth`
          : `http://localhost:4000/api/auth`,
        { withCredentials: true }
      );
      // console.log('response.data.quiz', response.data.quiz);
      setTrialLimit(response.data.quiz.quizNumberOfTrials);
      setReward(response.data.quiz.quizRewardType);
      setLeaderboardVisible(response.data.quiz.quizEnableLeaderboard);
      // console.log('leaderobard visible', leaderboardVisible);
      setQuizName(response.data.quiz.quizName);
      badge_qualifier.current = response.data.quiz.quizBadgeQualification;
      certificate_id.current = response.data.quiz.quizCertificate;
      // console.log('quizResult : ', quizResult[0]);

      setCorrect(currentQuizResult.correctedAnswerNum);
      // setCorrect(Number(quizResult[0].correctedAnswerNum));
      let questionLength =
        Number(response.data.quiz.quizTotalNumberOfQuestions) > 0
          ? Number(response.data.quiz.quizTotalNumberOfQuestions)
          : response.data.quiz.quizQuestions.length;
      setQues(questionLength);
    } catch (e) {
      console.error(e);
    }
  };
  console.log('ques length', ques);
  console.log('correct number : ', correct);
  let res = (correct / ques) * 100;
  console.log('res', res);
  const result = res.toFixed(0) + '';
  console.log('', result);

  const apicall = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Token token=38040def040af70134a08e39a3db35d3',
    },
  };

  const createCredential = async () => {
    if (
      Number(result) >= certificate_qualifier.current ||
      Number(result) >= badge_qualifier.current
    ) {
      console.log('inside create credential');
      const apidata = {
        credential: {
          recipient: {
            name: user.username,
            email: user.email,
            id: user.id,
          },
          group_name: quizName, //quizName.current
        },
      };
      try {
        // console.log(apidata);
        await axios
          .post(`https://api.accredible.com/v1/credentials`, apidata, apicall)
          .then((response) => {
            console.log(response);
            credential_id.current = response.data.credential.id;
            setImage(response.data.credential.badge.image.preview);
            console.log(response.data.credential.badge.image.preview);
            image.current = response.data.credential.badge.image.preview;
            console.log(img);
            console.log(img.current);
          });
        //pdfCredential()
        if (Number(result) >= badge_qualifier.current) {
          //createBadge()
          await axios
            .post(
              process.env.NODE_ENV == 'production'
                ? `/api/badge`
                : `http://localhost:4000/api/badge`,
              {
                badgeUploadFile: image.current,
                consumerId: user.id,
                badgeVisibility: true,
              }
            )
            .then((response) => {
              console.log(response);
            });
        }
        await axios
          .post(
            `https://api.accredible.com/v1/credentials/generate_single_pdf/${credential_id.current}`,
            {},
            apicall
          )
          .then((response) => {
            console.log(response);
            console.log(response.data.file);
            //file_download.current=response.data.file
            setFile(response.data.file);
          });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const goToLeaderboard = () => {
    history.push(`/leaderboard/${quizId}`);
  }

  const retakeQuiz = () =>{
    history.push(`/consumerquizpreview/${quizId}`);
  }

  useEffect(() => {
    getQuizInfo();
  }, []);

  // useEffect(() => {
  //   console.log('ques length', ques);
  //   console.log('correct number : ', correct);
  //   let res = (correct / ques) * 100;
  //   console.log('res', res);
  //   setResult(res.toFixed(2) + '');
  //   console.log('', result);
  // });

  useEffect(() => {
    if(result>=0 && result<=100){
      createCredential();
    }
  }, [result]);

  console.log('result', result);
  return (
    <div>
      <Box sx={{ display: 'flex', paddingTop: '80px', paddingLeft: '20px', paddingRight: '20px', justifyContent: 'center' }}>
        <Paper sx={{ borderRadius: '18px', display: 'flex' }}>
          <Grid container direction='row'>
            <Grid item container direction='column' alignItems='center' sx={{ margin: 5 }}>
              <Grid item justifySelf='center'>
                {
                  reward == 'none' ?
                  <Typography color='primary' className={classes.feedback}>Good job!</Typography>
                  : Number(result) >= certificate_qualifier.current || Number(result) >= badge_qualifier.current
                    ? <Typography color='primary' className={classes.result}>Congrats!</Typography>
                    : <Typography color='inherit' className={classes.result}>Sorry</Typography>
                }
              </Grid>
              <Grid item sx={{ paddingTop: '10px' }}>
                <Typography className={classes.secondary}>Your score:</Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.emphasized}>{result}%</Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.secondary}>{correct}/{ques} in {currentQuizResult.quizTimeTaken.minutes}:{currentQuizResult.quizTimeTaken.seconds} min</Typography>
              </Grid>
            </Grid>
            <Grid item container direction='row' alignItems='center' justifyContent='center' spacing={2} sx={{ margin: 3 }}>
              <Grid item>
                <Button className={classes.button}>Rewards</Button>
              </Grid>
              <Grid item>
                {leaderboardVisible ? 
                  <Button onClick={goToLeaderboard} className={classes.button}>Leaderboard</Button>
                  :
                  <Button disabled className={classes.button}>Leaderboard</Button>
                }
              </Grid>
              <Grid item>
                {trialLimit - currentQuizResult.usedTrialNumber == 0 ?
                  <Button disabled variant='success' className={classes.button}>Try again</Button>
                  :
                  <Button variant='success' onClick={retakeQuiz} className={classes.button}>Try again</Button>
                }
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {console.log('trialLimit - currentQuizResult.usedTrialNumber', trialLimit - currentQuizResult.usedTrialNumber)}
      {console.log('file_download', file_download)}
      {console.log(badge_qualifier.current)}
      {console.log(certificate_qualifier.current)}

      {/* badge image */}
      {badge_qualifier.current !== null && Number(result) >= badge_qualifier.current ? (
        <img src={img} width='200' height='200'></img>
      ) : (
        ''
      )}

      {/* certificate link */}
      {certificate_qualifier.current !== null && Number(result) >= certificate_qualifier.current ? (
        <a href={file_download} download>
          {' '}
          Click to download certificate{' '}
        </a>
      ) : (
        ''
      )}

      {/* <div>Current result : {JSON.stringify(currentQuizResult)}</div> */}

    </div>
  );
}

export default ResultsPage;

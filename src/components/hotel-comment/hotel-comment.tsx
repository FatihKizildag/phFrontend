import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCard, { Comment } from '../comment/comment';
import { useParams } from 'react-router-dom';
import { Box, TextField, Button, CircularProgress, Typography, Rating } from '@mui/material';
import styles from './hotel-comment.module.scss';

const HotelComment: React.FC = () => {
  const { _id } = useParams<{ _id: string }>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [transportationStar, setTransportationStar] = useState<number | null>(null);
  const [safetyStar, setSafetyStar] = useState<number | null>(null);
  const [hygieneStar, setHygieneStar] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setHasToken(!!token);

    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://phbackend-9rp2.onrender.com/hotels/comments?hotelId=${_id}`);
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setComments(response.data.comments);
        console.log(response.data);
        
      } catch (error) {
        console.error('Error fetching comments:', error);
        if (axios.isAxiosError(error)) {
          setError(error.response?.data.msg || 'An unexpected error occurred');
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [_id]);

  const handleCommentSubmit = async () => {
    setError(null); 
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You need to log in to post a comment.');
      return;
    }
  
    if (transportationStar === null || safetyStar === null || hygieneStar === null) {
      setError('Please rate all categories.');
      return;
    }
  
    try {
      const response = await axios.post(
        `https://phbackend-9rp2.onrender.com/comments?hotelId=${_id}`,
        {
          value: newComment,
          transportation_star: transportationStar,
          safety_star: safetyStar,
          hygiene_star: hygieneStar,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
        console.log(response.status);
      
      if (response.status === 200) {
        console.log("wqwe");
        
        setComments((prevComments) => [...prevComments, response.data]);
        setNewComment('');
        setTransportationStar(null);
        setSafetyStar(null);
        setHygieneStar(null);
      }
      else {
        throw new Error('Failed to post comment');
      }
    } catch (error) {
      console.log(error.response.status);
      
      if (error.response?.status === 406) {
        setError("You don't have permission to do that. Please create a reservation to comment.");
        alert("You don't have permission to do that. Please create a reservation to comment.")
      } else {
        setError(error.response?.data.msg || 'Failed to post comment.');
      }
    }
  };
  
  

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box className={styles.commentSection}>
      <Box className={styles.commentList}>
        {comments.map((comment) => (
          <CommentCard key={comment._id} comment={comment} />
        ))}
      </Box>
      {hasToken ? (
        <Box className={styles.commentForm}>
          <div className={styles.ratings}>
            <Box className={styles.rating}>
              <Typography component="legend">Transportation</Typography>
              <Rating
                name="transportation-rating"
                value={transportationStar}
                onChange={(event, newValue) => {
                  setTransportationStar(newValue);
                }}
              />
            </Box>
            <Box className={styles.rating}>
              <Typography component="legend">Safety</Typography>
              <Rating
                name="safety-rating"
                value={safetyStar}
                onChange={(event, newValue) => {
                  setSafetyStar(newValue);
                }}
              />
            </Box>
            <Box className={styles.rating}>
              <Typography component="legend">Hygiene</Typography>
              <Rating
                name="hygiene-rating"
                value={hygieneStar}
                onChange={(event, newValue) => {
                  setHygieneStar(newValue);
                }}
              />
            </Box>
          </div>
          <div className={styles.comment}>
            <TextField
              label="Add your comment"
              multiline
              rows={4}
              variant="outlined"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              fullWidth
            />
          </div>
          <Button sx={{ width: "fit-content" }} variant="contained" color="primary" onClick={handleCommentSubmit}>
            Submit
          </Button>
        </Box>
      ) : (
        <Typography>You need to log in to post a comment.</Typography>
      )}
    </Box>
  );
};

export default HotelComment;

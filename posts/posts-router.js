const router = require('express').Router();

const db = require('../data/db');

// create new post
router.post('/', (req, res) => {
  const updated = req.body;

  if (!updated.title || !updated.contents) {
    res.status(400).json({ error: 'Provide a title and content for the post' });
  }

  db.insert(updated)
    .then(data => res.status(201).json(updated))
    .catch(err => {
      res.status(500).json({ error: 'There was an error saving to the database' });
    });
});

// add new comment to post
router.post('/:id/comments', (req, res) => {
  const id = req.params.id;
  const comment = {...req.body, post_id: id};

  !comment.text && res.status(400).json({ message: 'Provide text for comment' });

  // if ID exists
  db.findById(id)
    .then(post => {
      // ID exists then add comment
      if (post.length) {
        db.insertComment(comment)
          .then(data => res.status(201).json(comment))
          .catch(err => {
            // console.log('Adding comment to posts failed:', err)
            res.status(500).json({ error: 'The was an error saving the comment to the post' });
          })
      } else {
        res.status(400).json({ message: 'The post with the specified ID does not exist' });
      }
    });
});

// Get all post
router.get('/', (req, res) => {
  db.find()
    .then(posts => res.status(200).json(posts))
    .catch(err => {
      res.status(500).json({ error: 'The posts could not be retrieved' })
    });
});

// Get post by ID
router.get('/', (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(post => {
      post.length
      ? res.status(200).json(post)
      : res.status(404).json({ error: 'The post with the specified ID does not exist' })
    })
    .catch(err => {
      res.status(500).json({ error: 'The post information could not be retrieved' })
    });
});

// Get comments on post
router.get('/:id/comments', (req, res) => {
  const id = req.params.id;

  db.findPostComments(id)
    .then(comments => {
      comments.length
      ? res.status(200).json(comments)
      : res.status(404).json({ error: 'The comments information could not be retrieved' });
    });
});

// Delete post by ID
router.delete('/:id', (req, res) => {
  const id = req.params.id

  db.remove(id)
    .then(deleted => {
      deleted > 0
      ? res.status(400).json(deleted)
      : res.status(404).json({ message: 'The post with the specified ID does not exist' })
    })
    .catch(err => {
      res.status(500).json({ error: 'The post could not be removed' })
    });
});

// edit a post
router.put('/:id', (req, res) => {
  const updated = req.body;
  const id = req.params.id;

  if (!updated.title || !updated.contents) {
    res.status(400).json({ error: 'Please provide title & content' })
  }

  db.update(id, updated)
    .then(updated => {
      if (updated > 0) {
        db.findById(id)
          .then(post => res.status(200).json(post))
          .catch(err => res.status(400).json({ error: 'The post with the specified ID does not exist' }))
      }
      else res.status(404).json({ error: 'The post with the specified ID does not exist' })
    })
    .catch(err => {
      res.status(500).json({ error: 'The post could not be modified' })
    });
});

module.exports = router;

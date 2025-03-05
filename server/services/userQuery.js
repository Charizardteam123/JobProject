export const parseUserQuery = async (req, res, next) => {
  console.log('Processing user resume input...');
  console.log(req.body);

  // Accept either 'resume' or 'userQuery' in the request body for flexibility
  const userInput = req.body.resume || req.body.userQuery;

  if (!userInput) {
    const error = {
      log: 'User resume not provided',
      status: 400,
      message: { err: 'Please provide a resume in the request body' },
    };
    return next(error);
  }

  if (typeof userInput !== 'string') {
    const error = {
      log: 'Invalid resume format - expected string',
      status: 400,
      message: { err: 'Resume must be provided as text' },
    };
    return next(error);
  }

  console.log('Resume input processed successfully');
  res.locals.userQuery = userInput;
  return next();
};

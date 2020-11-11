// extract any functions you are using to manipulate your data, into this file
exports.formatTimeStamp = (data) => {
  formattedData = data.map((element) => {
    const newElement = { ...element };
    const unixTime = newElement.created_at;
    const outputDate = new Date(unixTime).toLocaleDateString("en-US");
    const outputTime = new Date(unixTime).toLocaleTimeString("en-US");
    const output = `${outputDate} ${outputTime}`;
    newElement.created_at = output;
    return newElement;
  });
  return formattedData;
};

exports.formatComments = (commentData, articleRef) => {
  return commentData.map(({ belongs_to, created_by, ...restOfComments }) => {
    const newComments = {
      ...restOfComments,
      article_id: articleRef[belongs_to],
      author: created_by,
    };
    return newComments;
  });
};

exports.createArticleRef = (articleData) => {
  const ref = {};
  for (let article of articleData) {
    ref[article.title] = article.article_id;
  }
  return ref;
};

exports.formatArticleComments = (originalData) => {
  const newData = originalData.map(({ article_id, ...rest }) => {
    const newComments = { ...rest };
    return newComments;
  });
  return newData;
};

exports.removeBodyProperty = (originalData) => {
  const newData = originalData.map(({ body, ...rest }) => {
    const newComments = { ...rest };
    return newComments;
  });
  return newData;
};

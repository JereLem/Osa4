const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => {
      return total + blog.likes;
    }, 0);
  };

  const favoriteBlog = (blogs) =>{
    if (blogs.length === 0){
        return null
    }
    let favorite = blogs[0];

    blogs.forEach((blog) => {
        if(blog.likes > favorite.likes){
            favorite = blog
        }
    })
  return{
    title : favorite.title,
    author : favorite.author,
    likes : favorite.likes,
}
}

const mostBlogs = (blogs) =>{
    const blogCounts = {};
    blogs.forEach((blog) => {
        if (blog.author in blogCounts){
            blogCounts[blog.author]++;
        }else{
            blogCounts[blog.author]= 1;
        }
        });

        let maxBlogs = 0;
        let maxAuthor = "";
        for (let author in blogCounts) {
          if (blogCounts[author] > maxBlogs) {
            maxBlogs = blogCounts[author];
            maxAuthor = author;
          }
        }
      
        return { author: maxAuthor, blogs: maxBlogs };
      };

      const mostLikes = (blogs) => {
        const likesMax = blogs.reduce((likes, blog) => {
          if (blog.author in likes) {
            likes[blog.author] += blog.likes;
          } else {
            likes[blog.author] = blog.likes;
          }
          return likes;
        }, {});
      
        const authorWithMostLikes = Object.keys(likesMax).reduce((author, nextAuthor) => {
            return likesMax[nextAuthor] > likesMax[author] ? nextAuthor : author;
          });
          
      
        return {
          author: authorWithMostLikes,
          likes: likesMax[authorWithMostLikes]
        };
      };
      
  
  
  module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
  }
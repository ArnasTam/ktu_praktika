import App from '@/app';
import AuthRoute from '@routes/auth.route';
import CommentsRoute from '@routes/comments.route';
import IndexRoute from '@routes/index.route';
import PostsRoute from '@routes/posts.route';
import UserFollowsRoute from '@routes/user_follows.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new PostsRoute(), new CommentsRoute(), new UserFollowsRoute()]);

app.listen();

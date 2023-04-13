import App from '@/app';
import SocketSingleton from '@/scokets/socket_singleton';
import CommentsRoute from '@routes/comments.route';
import IndexRoute from '@routes/index.route';
import MessageRoute from '@routes/message.route';
import PostsRoute from '@routes/posts.route';
import UserFollowsRoute from '@routes/user_follows.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

new App().init().then(app => {
  const routes = [new IndexRoute(), new UsersRoute(), new PostsRoute(), new CommentsRoute(), new UserFollowsRoute(), new MessageRoute()];
  app.initializeRoutes(routes);
  app.listen();
  SocketSingleton.getInstance().configure(app.getServer());
});

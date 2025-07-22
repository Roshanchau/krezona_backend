import { Router } from "express";
import { gamesRoutes } from "../modules/games/games.routes";
import { blogsRoutes } from "../modules/blog/blog.routes";
import { eventsRoutes } from "../modules/event/event.routes";
import { authRouter } from "../modules/auth/auth.routes";


const router = Router();

const moduleRoutes=[
    {
        path: "/game",
        route: gamesRoutes,
    },
    {
        path: "/blog",
        route: blogsRoutes,
    },
    {
        path: "/event",
        route: eventsRoutes,
    },
    {
        path: "/auth",
        route: authRouter,
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
import { Router } from "express";
import { gamesRoutes } from "../modules/games/games.routes";
import { blogsRoutes } from "../modules/blog/blog.routes";
import { eventsRoutes } from "../modules/event/event.routes";


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
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
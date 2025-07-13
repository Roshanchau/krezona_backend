"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const games_routes_1 = require("../modules/games/games.routes");
const blog_routes_1 = require("../modules/blog/blog.routes");
const event_routes_1 = require("../modules/event/event.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/game",
        route: games_routes_1.gamesRoutes,
    },
    {
        path: "/blog",
        route: blog_routes_1.blogsRoutes,
    },
    {
        path: "/event",
        route: event_routes_1.eventsRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;

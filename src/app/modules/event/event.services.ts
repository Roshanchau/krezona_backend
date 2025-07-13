import prismadb from "../../db/prismaDb";
import AppError from "../../errors/appError";
import sendResponse from "../../middlewares/sendResponse";
import { TEvent } from "./event.interface";
import { Response } from "express";

// create a new event
const createevent = async (eventData: TEvent) => {
  const { name, eventDate, image } = eventData;

  if (!name || !eventData) {
    throw new AppError(400, "name and eventDate are required");
  }

  const existingevent = await prismadb.event.findFirst({
    where: {
      name: name,
    },
  });

  if (existingevent) {
    throw new AppError(400, "event with this name already exists");
  }

  const newevent = await prismadb.event.create({
    data: {
      name,
      eventDate,
      image: {
        create: {
          fileId: image?.fileId || "",
          name: image?.name || "",
          url: image?.url || "",
          thumbnailUrl: image?.thumbnailUrl || "",
        },
      },
    },
  });

  return { event: newevent };
};

// get all events
const getAllevents = async (res: Response) => {
  const events = await prismadb.event.findMany({
    include: {
      image: true,
    },
  });

  if (!events || events.length === 0) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "No events found",
    });
  }

  return events;
};

// get event by id
const geteventById = async (id: string, res: Response) => {
  const event = await prismadb.event.findFirst({
    where: {
      id: id,
    },
    include: {
      image: true,
    },
  });

  if (!event) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "event not found with this id",
    });
  }

  return event;
};

// update event
const updateevent = async (id: string, eventData: TEvent, res: Response) => {
  const { name, eventDate, image } = eventData;

  if (!name || !eventDate) {
    throw new AppError(400, "name and eventDate are required");
  }

  const existingevent = await prismadb.event.findFirst({
    where: {
      id: id,
    },
  });

  if (!existingevent) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "event not found with this id",
    });
  }

  const existingImage = await prismadb.eventImage.findFirst({
    where: {
      eventId: id,
    },
  });

  let updatedevent;
  if (!image) {
    await prismadb.eventImage.deleteMany({
      where: {
        eventId: id,
      },
    });

    updatedevent = await prismadb.event.update({
      where: {
        id: id,
      },
      data: {
        name,
        eventDate,
        image: {
          create: {
            fileId: existingImage?.fileId || "",
            name: existingImage?.name || "",
            url: existingImage?.url || "",
            thumbnailUrl: existingImage?.thumbnailUrl || "",
          },
        },
      },
    });

    return { event: updatedevent };
  }

  await prismadb.eventImage.deleteMany({
    where: {
      eventId: id,
    },
  });

   updatedevent = await prismadb.event.update({
        where:{
            id: id,
        },

        data: {
            name,
            eventDate,
            image: {
                create: {
                    fileId: image.fileId || "",
                    name: image.name || "",
                    url: image.url || "",
                    thumbnailUrl: image.thumbnailUrl || "",
                },
            },
        },
    });

  return { event: updatedevent };
};


// delete event
const deleteevent = async (id: string, res: Response) => {
  const existingevent = await prismadb.event.findFirst({
    where: {
      id: id,
    },
    });

    if (!existingevent) {
        return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "event not found with this id",
        });
    }

    const event= await prismadb.event.delete({
        where: {
            id: id,
        },
    });


    return event;
};

export const eventsService = {
  createevent,
  getAllevents,
  geteventById,
  updateevent,
  deleteevent,
};
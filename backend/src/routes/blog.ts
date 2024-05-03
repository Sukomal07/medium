import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createPostInput, updatePostInput } from "@sukomal07/common-app";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const jwt = c.req.header("Authorization");
  if (!jwt) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }
  const payload = await verify(jwt, c.env.JWT_SECRET);
  if (!payload) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }
  c.set("userId", payload.id);
  await next();
});

blogRouter.post("/create", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = createPostInput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({ error: "invalid input" });
  }
  const userId = c.get("userId");
  try {
    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    });

    c.status(200);
    return c.json({ blog });
  } catch (error) {
    c.status(411);
    return c.json({ error });
  }
});

blogRouter.put("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { id } = await c.req.param();
  const body = await c.req.json();
  const { success } = updatePostInput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({ error: "invalid input" });
  }
  try {
    const blog = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    if (!blog) {
      c.status(404);
      return c.json({ error: "Blog not found" });
    }

    c.status(200);
    return c.json({ blog });
  } catch (error) {
    c.status(411);
    return c.json({ error });
  }
});

blogRouter.get("/all/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { id } = await c.req.param();
  try {
    const blog = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });
    if (!blog) {
      c.status(404);
      return c.json({ error: "Blog not found" });
    }

    c.status(200);
    return c.json({ blog });
  } catch (error) {
    c.status(411);
    return c.json({ error });
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.findMany();
    console.log(blog);

    if (!blog) {
      c.status(404);
      return c.json({ error: "Blog not found" });
    }

    c.status(200);
    return c.json({ blog });
  } catch (error) {
    c.status(411);
    return c.json({ error });
  }
});

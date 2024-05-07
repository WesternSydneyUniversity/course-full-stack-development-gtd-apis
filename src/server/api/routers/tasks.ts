import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tasksRouter = createTRPCRouter({
  tasks: protectedProcedure.query(async ({ ctx, input }) => {
    return ctx.db.task.findMany({
      where: {
        userId: ctx.session.user.id
      }
    });
  }),
  addTask: protectedProcedure
    .input(z.object({ task: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          userId: ctx.session.user.id,
          description: input.task,
          completed: false
        }
      });
    }),
  changeTask: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        description: z.string(),
        completed: z.boolean()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: {
          id: input.id
        },
        data: {
          userId: ctx.session.user.id,
          description: input.description,
          completed: input.completed
        }
      });
    }),
  deleteTask: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.delete({
        where: {
          id: input
        }
      });
    })
});

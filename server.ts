import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

app.get("/usuario", async (req, res) => {
  const usuarios = await prisma.usuario.findMany();
  return res.json(usuarios);
});

app.get("/usuario/:id", async (req, res) => {
  const usuario = await prisma.usuario.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });
  if (usuario == null) {
    return res.send("Este Usuário não existe!");
  }
  return res.json(usuario);
});

app.post("/usuario", async (req, res) => {
  const { nome, email } = req.body;
  const email_usuario = await prisma.usuario.findFirst({
    where: {
      email: email,
    },
  });
  if (email_usuario == null) {
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
      },
    });
    return res.json(usuario);
  }
  return res.send("Este email já existe!");
});

app.put("/usuario/:id", async (req, res) => {
  const id_usuario = await prisma.usuario.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });
  if (id_usuario == null) {
    return res.send(
      "Não é possível alterar este usuário porque este usuário não existe!"
    );
  }
  const { nome, email } = req.body;
  const usuario = await prisma.usuario.update({
    data: {
      nome,
      email,
    },
    where: {
      id: Number(req.params.id),
    },
  });
  return res.json(usuario);
});

app.delete("/usuario/:id", async (req, res) => {
  const id_usuario = await prisma.usuario.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });
  if (id_usuario == null) {
    return res.send(
      "Não é possível excluir este usuário porque este usuário não existe!"
    );
  }
  await prisma.usuario.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  return res.send("Usuário excluído com sucesso!");
});

app.listen(3333, () => console.log("Server running!"));

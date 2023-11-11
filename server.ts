import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

//método para retornar todos os usuários:
app.get("/usuario", async (req, res) => {
  const usuarios = await prisma.usuario.findMany();
  return res.json(usuarios);
});

//método para retornar o usuário especificado por um id:
app.get("/usuario/:id", async (req, res) => {
  //verifica se o id do usuário existe:
  const usuario = await prisma.usuario.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });
  //se o usuário for null (não existir), uma mensagem é retornada:
  if (usuario == null) {
    return res.send("Este Usuário não existe!");
  }
  //se o usuário existir, ele é retornado:
  else{
    return res.json(usuario);
  }
});

//método para a inserção de um usuário:
app.post("/usuario", async (req, res) => {
  const { nome, email } = req.body;
  //verifica se o email já existe:
  const email_usuario = await prisma.usuario.findFirst({
    where: {
      email: email,
    },
  });
  //se o email for null (não existir), o usuário é inserido e retornado:
  if (email_usuario == null) {
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
      },
    });
    return res.json(usuario);
  }
  //se o email já existir, uma mensagem é retornada:
  else{
    return res.send("Este email já existe!");
  }
});

//método para atualização do usuário especificado por um id:
app.put("/usuario/:id", async (req, res) => {
  //verifica se o id do usuário existe:
  const id_usuario = await prisma.usuario.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });
  //se o id for null (não existir), uma mensagem é retornada:
  if (id_usuario == null) {
    return res.send(
      "Não é possível alterar este usuário porque este usuário não existe!"
    );
  }
  //se o id existir, o usuário é atualizado e retornado:
  else{
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
  }
});

//método para exclusão do usuário especificado por um id:
app.delete("/usuario/:id", async (req, res) => {
  //verifica se o id do usuário existe:
  const id_usuario = await prisma.usuario.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });
  //se o id for null (não existir), uma mensagem é retornada:
  if (id_usuario == null) {
    return res.send(
      "Não é possível excluir este usuário porque este usuário não existe!"
    );
  }
  //se o id existir, o usuário é excluído:
  else{
    await prisma.usuario.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    return res.send("Usuário excluído com sucesso!");
  }
});

app.listen(3333, () => console.log("Server running!"));

<script setup>

</script>

<template>
  <main>
    <div id="cabecalho">
      <h3>Cadastrar Plano</h3>
      <p id="subtitulo">Crie um novo plano para os alunos GymSync</p>
    </div>

    <div id="form">
      <div class="campo">
        <label>Nome do plano</label>
        <input type="text" placeholder="Ex: Plano Mensal" />
      </div>

      <div class="campo">
        <label>Descrição</label>
        <textarea placeholder="Descreva aqui o plano que deseja implementar."></textarea>
      </div>

      <div id="duplo">
        <div class="inputs">
          <label>Valor (R$)</label>
          <input type="number" placeholder="Ex: 99,99" />
        </div>
        <div class="inputs">
          <label>Duração (dias)</label>
          <input type="number" placeholder="30" />
        </div>
      </div>

      <div id="checkbox">
        <input type="checkbox" />
        <label>Plano ativo <strong>(visível para alunos)</strong></label>
      </div>

      <div id="botoes">
        <button type="submit" id="cadastrar">Cadastrar plano</button>
        <button id="cancelar">Cancelar</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  background-color: #EFF6FF;
  min-height: 100px;
  padding: 32px;
}

#cabecalho {
  margin-bottom: 24px;
}

h3 {
  color: #172554;
  font-size: 22px;
  margin: 0 0 4px;
}

#subtitulo {
  color: #2563EB;
  font-size: 13px;
  margin: 0;
}

#form {
  background-color: #fff;
  border: 0.5px solid #BFDBFE;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

label {
  display: block;
  font-size: 15px;
  font-weight: 500;
  color: #1E3A8A;
  margin-bottom: 6px;
}

input[type="text"],
input[type="number"],
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 12px;
  border: 0.5px solid #BFDBFE;
  border-radius: 8px;
  font-size: 14px;
  color: #172554;
  background-color: #EFF6FF;
  outline: none;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

#duplo {
  display: flex;
  gap: 16px;
}

#duplo .inputs {
  flex: 1;
}

#checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1E3A8A;
  font-size: 13px;
}

#checkbox label {
  margin: 0;
  color: #1E3A8A;
}

#checkbox input {
  width: 16px;
  height: 16px;
  accent-color: #2563EB;
}

#botoes {
  display: flex;
  gap: 12px;
}

#cadastrar {
  flex: 1;
  background-color: #2563EB;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

#cancelar {
  background-color: transparent;
  color: #2563EB;
  border: 0.5px solid #BFDBFE;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
}
</style>

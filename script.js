// ==========================================
// CONFIGURAÇÕES IMPORTANTES
// ==========================================
const URL_GOOGLE_SCRIPT =
  "https://script.google.com/macros/s/AKfycbxjwNRwpnJUlOlp6xVWQtIGtC_O2-n5PZeF53oFC9ug7ngA-rilDKmvkK3PWXZz8tfI/exec";
const NUMERO_WHATSAPP = "5548991268440";
// ==========================================

// LÓGICA PARA BLOQUEAR DATAS RETROATIVAS
document.addEventListener("DOMContentLoaded", () => {
  const dataAtual = new Date();
  const ano = dataAtual.getFullYear();
  const mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
  const dia = String(dataAtual.getDate()).padStart(2, "0");

  // Define a data mínima no input HTML como o dia de hoje
  document.getElementById("data").min = `${ano}-${mes}-${dia}`;
});

document
  .getElementById("formReserva")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const btnSubmit = document.getElementById("btnReservar");
    const txtOriginal = btnSubmit.innerText;

    btnSubmit.innerText = "A verificar disponibilidade...";
    btnSubmit.disabled = true;

    const dadosReserva = {
      nome: document.getElementById("nome").value,
      telefone: document.getElementById("telefone").value,
      data: document.getElementById("data").value,
      hora: document.getElementById("hora").value,
      pessoas: document.getElementById("pessoas").value,
    };

    try {
      const response = await fetch(URL_GOOGLE_SCRIPT, {
        method: "POST",
        body: JSON.stringify(dadosReserva),
      });

      const resultado = await response.json();

      if (resultado.status === "sucesso") {
        // NOVA MENSAGEM DO WHATSAPP COM O AVISO
        const textoPadrao = `Olá! O sistema confirmou a minha reserva para o dia ${dadosReserva.data} às ${dadosReserva.hora}, para ${dadosReserva.pessoas} pessoas. Nome: ${dadosReserva.nome}.\n\n⚠️️ Estou ciente de que a reserva é mantida até as 20:30. Após esse horário, a mesa poderá ser repassada.\n\nAguardo o vosso OK!`;

        window.open(
          `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(textoPadrao)}`,
          "_blank",
        );

        alert(
          "Mesa garantida! A redirecionar para o WhatsApp do restaurante...",
        );
        document.getElementById("formReserva").reset();
      } else if (resultado.status === "esgotado") {
        alert(
          "Infelizmente, todas as mesas que comportam o seu grupo já estão reservadas para este horário. Por favor, tente outra hora.",
        );
      } else {
        alert("Ocorreu um erro no servidor. Tente novamente.");
      }
    } catch (error) {
      console.error("Falha na comunicação:", error);
      alert("Erro de ligação. Verifique a sua internet e tente novamente.");
    } finally {
      btnSubmit.innerText = txtOriginal;
      btnSubmit.disabled = false;
    }
  });

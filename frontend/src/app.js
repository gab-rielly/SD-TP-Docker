document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('beer-name');
    const addToDB1Button = document.getElementById('add-to-db1');
    const addToDB2Button = document.getElementById('add-to-db2');
    const removeFromDB1Button = document.getElementById('remove-from-db1');
    const removeFromDB2Button = document.getElementById('remove-from-db2');
    const compareButton = document.getElementById('compare-beers');
    const beersDB1List = document.getElementById('beers-db1');
    const beersDB2List = document.getElementById('beers-db2');
    const comparisonResult = document.getElementById('comparison-result');
  
    const apiUrl = 'http://localhost:3000'; // Ajuste conforme necessário
  
    // Função para fazer requisição POST para adicionar cerveja
    const addBeer = async (db) => {
      try {
        const response = await fetch(`${apiUrl}/add-beer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: nameInput.value, db })
        });
        if (response.ok) {
          nameInput.value = '';
          fetchBeers();
        } else {
          alert('Failed to add beer');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    // Função para fazer requisição DELETE para remover cerveja
    const removeBeer = async (db) => {
      try {
        const response = await fetch(`${apiUrl}/remove-beer`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: nameInput.value, db })
        });
        if (response.ok) {
          nameInput.value = '';
          fetchBeers();
        } else {
          alert('Failed to remove beer');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    // Função para comparar cervejas nos dois bancos de dados
    const compareBeers = async () => {
        try {
          const response = await fetch(`${apiUrl}/compare-beer?name=${nameInput.value}`);
          const result = await response.json();
      
          // Exibe a comparação de forma detalhada
          if (result.inDb1 && result.inDb2) {
            comparisonResult.textContent = `A cerveja "${result.name}" está em ambos os bancos.`;
          } else if (result.inDb1) {
            comparisonResult.textContent = `A cerveja "${result.name}" está apenas no DB1.`;
          } else if (result.inDb2) {
            comparisonResult.textContent = `A cerveja "${result.name}" está apenas no DB2.`;
          } else {
            comparisonResult.textContent = `A cerveja "${result.name}" não está em nenhum dos bancos.`;
          }
        } catch (error) {
          console.error('Error:', error);
          comparisonResult.textContent = 'Erro ao comparar cervejas';
        }
      };
      
  
    // Função para buscar cervejas dos dois bancos de dados
    const fetchBeers = async () => {
      try {
        const response1 = await fetch(`${apiUrl}/beers?db=db1`);
        const beers1 = await response1.json();
        beersDB1List.innerHTML = beers1.map(beer => `<li>${beer.name}</li>`).join('');
  
        const response2 = await fetch(`${apiUrl}/beers?db=db2`);
        const beers2 = await response2.json();
        beersDB2List.innerHTML = beers2.map(beer => `<li>${beer.name}</li>`).join('');
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    // Adiciona eventos aos botões
    addToDB1Button.addEventListener('click', () => addBeer('db1'));
    addToDB2Button.addEventListener('click', () => addBeer('db2'));
    removeFromDB1Button.addEventListener('click', () => removeBeer('db1'));
    removeFromDB2Button.addEventListener('click', () => removeBeer('db2'));
    compareButton.addEventListener('click', compareBeers);
  
    // Inicializa a lista de cervejas
    fetchBeers();
});

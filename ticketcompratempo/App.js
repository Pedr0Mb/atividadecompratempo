import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';

export default function App() {
  const [tempoTotal, setTempoTotal] = useState(0);
  const [custoTotal, setCustoTotal] = useState(0);
  const [minutosPersonalizados, setMinutosPersonalizados] = useState('');
  const [temporizadorAtivo, setTemporizadorAtivo] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);

  useEffect(() => {
    let intervalo;
    if (temporizadorAtivo && tempoRestante > 0) {
      intervalo = setInterval(() => {
        setTempoRestante(prev => {
          if (prev <= 1) {
            clearInterval(intervalo);
            setTemporizadorAtivo(false);
            
            Alert.alert(
              'Tempo Esgotado',
              `Você utilizou ${formatarTempo(tempoTotal)} e gastou R$ ${custoTotal.toFixed(2)}`,
              [
                {
                  text: 'OK',
                  onPress: () => {
             
                    setTempoTotal(0);
                    setCustoTotal(0);
                  }
                }
              ]
            );
            
            return 0;
          }
          return prev - 1;
        });
      }, 600000);
    }

    return () => clearInterval(intervalo);
  }, [temporizadorAtivo, tempoRestante, tempoTotal, custoTotal]);

  const comprarTicket = (minutos) => {
    let custo = 0;
    if (minutos === 1) {
      custo = 3;
    } else if (minutos === 2) {
      custo = 5;
    } else {
      return;
    }
    
    setTempoTotal(prev => prev + minutos);
    setCustoTotal(prev => prev + custo);
    setTempoRestante(prev => prev + minutos);
    setTemporizadorAtivo(true);
  };

  const comprarTicketPersonalizado = () => {
    const minutos = parseInt(minutosPersonalizados, 10);
    
    if (isNaN(minutos)) {
      Alert.alert('Erro', 'Por favor, insira um número válido');
      return;
    }
    
    if (minutos <= 2) {
      Alert.alert('Erro', 'O tempo deve ser maior que 2 minutos');
      return;
    }
    
    if (minutos > 30) {
      Alert.alert('Erro', 'O limite máximo é de 30 minutos por cliente');
      return;
    }
    
   
    let custo = 5; 
    
   
    const minutosAdicionais = minutos - 2;
    let desconto = 0;
    

    const blocosDesconto = Math.floor(minutos / 10);
    desconto = blocosDesconto * 0.05;
    
    
    const precoPorMinutoComDesconto = 1.5 * (1 - desconto);
    
    custo += minutosAdicionais * precoPorMinutoComDesconto;
    
    setTempoTotal(prev => prev + minutos);
    setCustoTotal(prev => prev + custo);
    setTempoRestante(prev => prev + minutos);
    setTemporizadorAtivo(true);
    setMinutosPersonalizados('');
  };

  const formatarTempo = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas > 0 ? horas + 'h ' : ''}${mins}m`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Validação de Tickets</Text>
      
      <View style={styles.containerTemporizador}>
        <Text style={styles.textoTemporizador}>Tempo Acumulado: {formatarTempo(tempoTotal)}</Text>
        <Text style={styles.textoTemporizador}>Custo Total: R$ {custoTotal.toFixed(2)}</Text>
        {temporizadorAtivo && (
          <Text style={styles.temporizadorAtivo}>Tempo Restante: {formatarTempo(tempoRestante)}</Text>
        )}
      </View>
      
      <View style={styles.containerBotoes}>
        <TouchableOpacity 
          style={styles.botao}
          onPress={() => comprarTicket(1)}
        >
          <Text style={styles.textoBotao}>1 minuto - R$ 3,00</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.botao}
          onPress={() => comprarTicket(2)}
        >
          <Text style={styles.textoBotao}>2 minutos - R$ 5,00</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.containerPersonalizado}>
        <TextInput
          style={styles.entrada}
          placeholder="Minutos (mais que 2)"
          keyboardType="numeric"
          value={minutosPersonalizados}
          onChangeText={setMinutosPersonalizados}
        />
        
        <TouchableOpacity 
          style={styles.botaoPersonalizado}
          onPress={comprarTicketPersonalizado}
        >
          <Text style={styles.textoBotao}>Tempo Personalizado</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  containerTemporizador: {
    marginBottom: 30,
    alignItems: 'center',
  },
  textoTemporizador: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  temporizadorAtivo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginTop: 10,
  },
  containerBotoes: {
    width: '100%',
    marginBottom: 20,
  },
  botao: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  textoBotao: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  containerPersonalizado: {
    width: '100%',
    marginTop: 10,
  },
  entrada: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  botaoPersonalizado: {
   backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
});
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// ----- Tela de Lista -----
function ListaPetsScreen({ navigation, pets }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Encontre seu novo amigo</Text>
        <Text style={styles.headerSubtitle}>{pets.length} pets disponíveis</Text>
      </View>
      
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("DetalhesPet", { pet: item })}
          >
            <Image source={{ uri: item.foto }} style={styles.imagem} />
            <View style={styles.cardContent}>
              <Text style={styles.nome}>{item.nome}</Text>
              <View style={styles.petInfo}>
                <View style={[styles.infoBadge, styles[item.sexo.toLowerCase()]]}>
                  <Text style={styles.infoText}>{item.sexo}</Text>
                </View>
                <Text style={styles.idade}>• {item.idade}</Text>
              </View>
              <Text style={styles.historiaPreview} numberOfLines={2}>
                {item.historia}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C8C8C8" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ----- Tela de Detalhes -----
function DetalhesPetScreen({ route }) {
  const { pet } = route.params;
  
  const getSexoColor = () => {
    return pet.sexo.toLowerCase() === 'macho' ? '#4A90E2' : '#E94C89';
  };

  return (
    <ScrollView style={styles.detailContainer} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: pet.foto }} style={styles.fotoGrande} />
      
      <View style={styles.detailContent}>
        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>{pet.nome}</Text>
          <View style={[styles.sexoBadge, { backgroundColor: getSexoColor() }]}>
            <Text style={styles.sexoText}>{pet.sexo}</Text>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Idade:</Text>
            <Text style={styles.infoValue}>{pet.idade}</Text>
          </View>
        </View>
        
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Sobre {pet.nome}</Text>
          <Text style={styles.historyText}>{pet.historia}</Text>
        </View>
        
        <TouchableOpacity style={styles.adoptButton}>
          <Text style={styles.adoptButtonText}>Quero Adotar!</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ----- Tela de Cadastro -----
function CadastroScreen({ pets, setPets }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");

  const [especie, setEspecie] = useState("");
  const [sexo, setSexo] = useState("");
  const [idade, setIdade] = useState("");
  const [porte, setPorte] = useState("");

  // Helpers de formatação
  const onlyDigits = (text = "") => text.replace(/\D/g, "");
  const formatCelular = (text = "") => {
    const d = onlyDigits(text).slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
  };
  const formatDate = (text = "") => {
    const d = onlyDigits(text).slice(0, 8);
    if (d.length <= 2) return d;
    if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
    return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  };

  // Validações
  const emailValido = /\S+@\S+\.\S+/.test(email);
  const senhaConfere = senha !== "" && senha === confSenha;
  const formValido =
    nome &&
    emailValido &&
    celular.length === 15 &&
    dataNasc.length === 10 &&
    senhaConfere &&
    especie &&
    sexo &&
    idade &&
    porte;

  // Botão de seleção
  const BotaoSelecao = ({ label, value, selected, onPress, icon }) => (
    <TouchableOpacity
      style={[styles.btnSelecao, selected === value && styles.btnSelecionado]}
      onPress={() => onPress(value)}
    >
      {icon && <Ionicons name={icon} size={20} color={selected === value ? "#fff" : "#666"} style={styles.btnIcon} />}
      <Text
        style={[styles.textBtn, selected === value && styles.textBtnSelecionado]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Ação final
  const handleSubmit = () => {
    const novoPet = {
      id: String(pets.length + 1),
      nome,
      idade,
      sexo,
      historia: `Pet cadastrado por ${nome}, porte ${porte}.`,
      foto: especie === "gato"
        ? "https://placekitten.com/200/200"
        : "https://place-puppy.com/200x200",
    };

    setPets([...pets, novoPet]);

    Alert.alert("Cadastro realizado! 🎉", `${nome}, seu pedido foi salvo.`);

    // limpa formulário
    setNome(""); setEmail(""); setCelular(""); setDataNasc("");
    setSenha(""); setConfSenha(""); setEspecie(""); setSexo(""); setIdade(""); setPorte("");
  };

  return (
    <ScrollView 
      style={styles.formScrollContainer}
      contentContainerStyle={styles.formContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>🐾 Seus Dados</Text>
        <Text style={styles.formSubtitle}>Preencha suas informações pessoais</Text>
      </View>

      <View style={styles.inputGroup}>
        <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput 
          style={styles.input} 
          placeholder="Nome Completo" 
          placeholderTextColor="#999"
          value={nome} 
          onChangeText={setNome} 
        />
      </View>

      <View style={styles.inputGroup}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput 
          style={styles.input} 
          placeholder="E-mail" 
          placeholderTextColor="#999"
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
          autoCapitalize="none" 
        />
      </View>

      <View style={styles.inputGroup}>
        <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput 
          style={styles.input} 
          placeholder="Celular" 
          placeholderTextColor="#999"
          value={celular} 
          onChangeText={(t) => setCelular(formatCelular(t))} 
          keyboardType="phone-pad" 
        />
      </View>

      <View style={styles.inputGroup}>
        <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput 
          style={styles.input} 
          placeholder="Data de Nascimento" 
          placeholderTextColor="#999"
          value={dataNasc} 
          onChangeText={(t) => setDataNasc(formatDate(t))} 
          keyboardType="number-pad" 
        />
      </View>

      <View style={styles.inputGroup}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput 
          style={styles.input} 
          placeholder="Senha" 
          placeholderTextColor="#999"
          value={senha} 
          onChangeText={setSenha} 
          secureTextEntry 
        />
      </View>

      <View style={styles.inputGroup}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput 
          style={styles.input} 
          placeholder="Confirmar Senha" 
          placeholderTextColor="#999"
          value={confSenha} 
          onChangeText={setConfSenha} 
          secureTextEntry 
        />
      </View>

      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>🐶🐱 Preferências para Adoção</Text>
        <Text style={styles.formSubtitle}>Escolha as características do pet ideal</Text>
      </View>

      <Text style={styles.label}>Espécie</Text>
      <View style={styles.row}>
        <BotaoSelecao 
          label="Cachorro" 
          value="cachorro" 
          selected={especie} 
          onPress={setEspecie}
          icon="paw-outline"
        />
        <BotaoSelecao 
          label="Gato" 
          value="gato" 
          selected={especie} 
          onPress={setEspecie}
          icon="paw-outline"
        />
      </View>

      <Text style={styles.label}>Sexo</Text>
      <View style={styles.row}>
        <BotaoSelecao 
          label="Macho" 
          value="macho" 
          selected={sexo} 
          onPress={setSexo}
          icon="male-outline"
        />
        <BotaoSelecao 
          label="Fêmea" 
          value="femea" 
          selected={sexo} 
          onPress={setSexo}
          icon="female-outline"
        />
      </View>

      <Text style={styles.label}>Idade</Text>
      <View style={styles.row}>
        <BotaoSelecao 
          label="Filhote" 
          value="filhote" 
          selected={idade} 
          onPress={setIdade}
          icon="heart-outline"
        />
        <BotaoSelecao 
          label="Adulto" 
          value="adulto" 
          selected={idade} 
          onPress={setIdade}
          icon="body-outline"
        />
        <BotaoSelecao 
          label="Idoso" 
          value="idoso" 
          selected={idade} 
          onPress={setIdade}
          icon="accessibility-outline"
        />
      </View>

      <Text style={styles.label}>Porte</Text>
      <View style={styles.row}>
        <BotaoSelecao 
          label="Pequeno" 
          value="pequeno" 
          selected={porte} 
          onPress={setPorte}
          icon="ellipse-outline"
        />
        <BotaoSelecao 
          label="Médio" 
          value="medio" 
          selected={porte} 
          onPress={setPorte}
          icon="ellipse-outline"
        />
        <BotaoSelecao 
          label="Grande" 
          value="grande" 
          selected={porte} 
          onPress={setPorte}
          icon="ellipse-outline"
        />
      </View>

      <TouchableOpacity
        style={[styles.btnFinal, !formValido && styles.btnDesabilitado]}
        disabled={!formValido}
        onPress={handleSubmit}
      >
        <Text style={styles.textFinal}>Quero Adotar!</Text>
        <Ionicons name="heart" size={20} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

// ----- Tela Sobre -----
function SobreScreen() {
  return (
    <ScrollView style={styles.aboutContainer} contentContainerStyle={styles.aboutContent}>
      <View style={styles.aboutHeader}>
        <Text style={styles.aboutTitle}>Sobre o Abrigo</Text>
        <Text style={styles.aboutSubtitle}>Dando um lar para quem mais precisa</Text>
      </View>
      
      <View style={styles.aboutCard}>
        <Ionicons name="heart" size={40} color="#FF6B6B" style={styles.aboutIcon} />
        <Text style={styles.aboutCardTitle}>Nossa Missão</Text>
        <Text style={styles.aboutCardText}>
          Conectamos animais abandonados com famílias amorosas, promovendo 
          a adoção responsável e consciente.
        </Text>
      </View>
      
      <View style={styles.aboutCard}>
        <Ionicons name="stats-chart" size={40} color="#4ECDC4" style={styles.aboutIcon} />
        <Text style={styles.aboutCardTitle}>Números</Text>
        <Text style={styles.aboutCardText}>
          Mais de 1.000 pets já encontraram um lar através do nosso app. 
          Junte-se a nós nessa causa!
        </Text>
      </View>
      
      <View style={styles.aboutCard}>
        <Ionicons name="people" size={40} color="#45B7D1" style={styles.aboutIcon} />
        <Text style={styles.aboutCardTitle}>Voluntários</Text>
        <Text style={styles.aboutCardText}>
          Contamos com uma equipe dedicada de voluntários que cuidam 
          dos animais com muito amor e carinho.
        </Text>
      </View>
    </ScrollView>
  );
}

// ----- Stack Navigator -----
const Stack = createStackNavigator();
function AdocaoStack({ pets }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF9F1C',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ListaPets" 
        options={{ title: "Pets para Adoção" }}
      >
        {(props) => <ListaPetsScreen {...props} pets={pets} />}
      </Stack.Screen>
      <Stack.Screen 
        name="DetalhesPet" 
        component={DetalhesPetScreen} 
        options={{ title: "Detalhes do Pet" }} 
      />
    </Stack.Navigator>
  );
}

// ----- Tabs -----
const Tab = createBottomTabNavigator();

export default function App() {
  const [pets, setPets] = useState([
    { id: "1", nome: "Rex", idade: "2 anos", sexo: "Macho", historia: "Um cachorro muito brincalhão que adora correr no parque e brincar com bolinhas. É muito carinhoso e se dá bem com crianças e outros animais.", foto: "https://place-puppy.com/300x300" },
    { id: "2", nome: "Luna", idade: "1 ano", sexo: "Fêmea", historia: "Gatinha carinhosa que adora dormir no colo e brincar com arranhadores. Muito tranquila e educada, usa perfeitamente a caixinha de areia.", foto: "https://placekitten.com/300/300" },
    { id: "3", nome: "Thor", idade: "3 anos", sexo: "Macho", historia: "Cachorro de porte médio, muito protetor e leal. Adora longas caminhadas e é muito inteligente, aprende comandos rapidamente.", foto: "https://place-puppy.com/300x300" },
  ]);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;
            if (route.name === "Adoção") iconName = focused ? "paw" : "paw-outline";
            else if (route.name === "Cadastrar") iconName = focused ? "create" : "create-outline";
            else if (route.name === "Sobre") iconName = focused ? "information-circle" : "information-circle-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF9F1C',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#f0f0f0',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Adoção">
          {(props) => <AdocaoStack {...props} pets={pets} />}
        </Tab.Screen>
        <Tab.Screen name="Cadastrar">
          {(props) => <CadastroScreen {...props} pets={pets} setPets={setPets} />}
        </Tab.Screen>
        <Tab.Screen name="Sobre" component={SobreScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// ----- Estilos -----
const styles = StyleSheet.create({
  // Estilos gerais
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  
  // Header da lista
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#636E72',
  },
  
  // Lista de pets
  listContainer: {
    padding: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imagem: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#2D3436',
    marginBottom: 5,
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  macho: {
    backgroundColor: '#4A90E2',
  },
  femea: {
    backgroundColor: '#E94C89',
  },
  infoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  idade: {
    fontSize: 14,
    color: '#636E72',
  },
  historiaPreview: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 18,
  },
  
  // Tela de detalhes
  detailContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  fotoGrande: {
    width: '100%',
    height: 300,
  },
  detailContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  sexoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  sexoText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginLeft: 10,
    marginRight: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#636E72',
  },
  historySection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 10,
  },
  historyText: {
    fontSize: 16,
    color: '#636E72',
    lineHeight: 24,
  },
  adoptButton: {
    backgroundColor: '#FF9F1C',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#FF9F1C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  adoptButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Formulário
  formScrollContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  formHeader: {
    marginBottom: 20,
    marginTop: 10,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 5,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#636E72',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#2D3436',
  },
  label: {
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "600",
    color: "#2D3436",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 15,
    flexWrap: "wrap",
  },
  btnSelecao: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  btnSelecionado: {
    backgroundColor: "#FF9F1C",
    borderColor: "#FF9F1C",
  },
  btnIcon: {
    marginRight: 5,
  },
  textBtn: {
    color: "#636E72",
    fontWeight: '500',
  },
  textBtnSelecionado: {
    color: "#fff",
    fontWeight: "bold",
  },
  btnFinal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FF9F1C",
    padding: 18,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#FF9F1C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  btnDesabilitado: {
    backgroundColor: "#BDC3C7",
    shadowOpacity: 0,
    elevation: 0,
  },
  textFinal: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 8,
  },
  
  // Tela Sobre
  aboutContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  aboutContent: {
    padding: 20,
  },
  aboutHeader: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 10,
  },
  aboutTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  aboutSubtitle: {
    fontSize: 18,
    color: '#636E72',
    textAlign: 'center',
  },
  aboutCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  aboutIcon: {
    marginBottom: 15,
  },
  aboutCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 10,
    textAlign: 'center',
  },
  aboutCardText: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 22,
  },
});
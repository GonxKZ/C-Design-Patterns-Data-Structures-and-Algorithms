const immutabilityPattern = {
  id: 'immutability',
  name: 'Immutability',
  category: 'functional',
  description: 'Promueve el uso de objetos inmutables que no pueden ser modificados después de su creación, facilitando código más predecible, seguro y paralelizable.',
  theory: {
    background: 'La inmutabilidad es un principio fundamental de la programación funcional, presente en lenguajes como Haskell, Clojure y Erlang. En lugar de modificar el estado de los objetos, se crean nuevas versiones cuando un cambio es necesario, preservando los objetos originales. Este enfoque evita efectos secundarios inesperados y facilita el razonamiento sobre el comportamiento del código.',
    problem: 'El estado mutable genera varios desafíos: 1) Efectos secundarios impredecibles cuando múltiples partes del código modifican el mismo objeto, 2) Dificultad para razonar sobre el programa cuando el estado puede cambiar en cualquier momento, 3) Comportamientos inesperados en entornos concurrentes cuando múltiples hilos modifican datos compartidos, 4) Problemas para implementar características como viaje en el tiempo o historial de cambios, 5) Complejidad creciente al depurar código donde el estado se modifica en múltiples lugares.',
    solution: 'Adoptar objetos inmutables que no pueden ser modificados después de su creación. Cuando se necesita realizar un cambio, se crea una nueva instancia que incorpora la modificación mientras mantiene intacta la original. Esto se puede implementar mediante: a) Congelamiento de objetos para prevenir modificaciones, b) Métodos que devuelven nuevas instancias en lugar de modificar la actual, c) Estructuras de datos persistentes que comparten eficientemente memoria con versiones anteriores, d) Operadores y bibliotecas que facilitan la creación de copias con modificaciones específicas.',
    applicability: [
      'Sistemas multiusuario o multihilo donde el estado compartido debe ser protegido',
      'Aplicaciones que requieren seguimiento de historiales o capacidad de deshacer/rehacer acciones',
      'Código donde la previsibilidad y facilidad de razonamiento son críticas',
      'Situaciones donde se necesita simplificar la depuración y las pruebas',
      'Implementaciones de patrones como Redux donde el estado global sigue un flujo unidireccional',
      'Sistemas que utilizan técnicas avanzadas como memoización o programación reactiva'
    ],
    consequences: [
      'Mayor previsibilidad y facilidad para razonar sobre el comportamiento del código',
      'Simplificación del manejo de concurrencia al eliminar condiciones de carrera sobre datos compartidos',
      'Facilidad para implementar funcionalidades como viaje en el tiempo y análisis de historiales',
      'Posibilidad de optimizaciones como memoización y evaluación perezosa',
      'Potencial sobrecarga de memoria y rendimiento si no se implementa eficientemente',
      'Complejidad adicional para desarrolladores acostumbrados a paradigmas imperativos',
      'Necesidad de utilizar bibliotecas o patrones específicos para mantener la eficiencia'
    ]
  },
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <memory>

// Clase inmutable simple
class ImmutablePerson {
private:
    const std::string name;
    const int age;
    
    // Constructor privado para evitar modificaciones externas
    ImmutablePerson(const std::string& name, int age) : name(name), age(age) {}
    
public:
    // Método de fábrica estático
    static std::shared_ptr<ImmutablePerson> create(const std::string& name, int age) {
        return std::shared_ptr<ImmutablePerson>(new ImmutablePerson(name, age));
    }
    
    // Métodos para acceder a los datos
    std::string getName() const { return name; }
    int getAge() const { return age; }
    
    // Métodos que "modifican" creando una nueva instancia
    std::shared_ptr<ImmutablePerson> withName(const std::string& newName) const {
        return create(newName, age);
    }
    
    std::shared_ptr<ImmutablePerson> withAge(int newAge) const {
        return create(name, newAge);
    }
    
    std::shared_ptr<ImmutablePerson> withNameAndAge(const std::string& newName, int newAge) const {
        return create(newName, newAge);
    }
    
    // Método para imprimir para depuración
    void print() const {
        std::cout << "Persona: " << name << ", " << age << " años" << std::endl;
    }
};

// Colección inmutable simple
template<typename T>
class ImmutableVector {
private:
    std::shared_ptr<std::vector<T>> data;
    
    // Constructor privado
    explicit ImmutableVector(std::shared_ptr<std::vector<T>> data) : data(data) {}
    
public:
    // Constructor por defecto
    ImmutableVector() : data(std::make_shared<std::vector<T>>()) {}
    
    // Constructor con elementos iniciales
    ImmutableVector(std::initializer_list<T> items) : data(std::make_shared<std::vector<T>>(items)) {}
    
    // Métodos de acceso
    size_t size() const { return data->size(); }
    bool empty() const { return data->empty(); }
    const T& at(size_t index) const { return data->at(index); }
    
    // Métodos "modificadores" que devuelven nuevas instancias
    ImmutableVector<T> append(const T& item) const {
        auto newData = std::make_shared<std::vector<T>>(*data);
        newData->push_back(item);
        return ImmutableVector<T>(newData);
    }
    
    ImmutableVector<T> remove(size_t index) const {
        if (index >= data->size()) throw std::out_of_range("Índice fuera de rango");
        
        auto newData = std::make_shared<std::vector<T>>(*data);
        newData->erase(newData->begin() + index);
        return ImmutableVector<T>(newData);
    }
    
    ImmutableVector<T> map(std::function<T(const T&)> f) const {
        auto newData = std::make_shared<std::vector<T>>();
        newData->reserve(data->size());
        
        std::transform(data->begin(), data->end(), std::back_inserter(*newData), f);
        return ImmutableVector<T>(newData);
    }
    
    // Recorrido de la colección
    void forEach(std::function<void(const T&)> action) const {
        for (const auto& item : *data) {
            action(item);
        }
    }
};

int main() {
    // Uso de la clase inmutable
    auto person = ImmutablePerson::create("Carlos", 30);
    person->print();
    
    auto olderPerson = person->withAge(31);
    olderPerson->print();
    
    // El objeto original no cambia
    person->print();
    
    // Uso de la colección inmutable
    ImmutableVector<int> numbers = {1, 2, 3, 4, 5};
    
    auto doubledNumbers = numbers.map([](int n) { return n * 2; });
    auto numbersWithoutThree = numbers.remove(2);
    auto extendedNumbers = numbers.append(6);
    
    std::cout << "Original: ";
    numbers.forEach([](int n) { std::cout << n << " "; });
    std::cout << std::endl;
    
    std::cout << "Duplicados: ";
    doubledNumbers.forEach([](int n) { std::cout << n << " "; });
    std::cout << std::endl;
    
    std::cout << "Sin el 3: ";
    numbersWithoutThree.forEach([](int n) { std::cout << n << " "; });
    std::cout << std::endl;
    
    std::cout << "Con el 6: ";
    extendedNumbers.forEach([](int n) { std::cout << n << " "; });
    std::cout << std::endl;
    
    return 0;
}`,
      explanation: [
        { line: 7, text: "Definición de una clase inmutable para representar a una persona." },
        { line: 11, text: "Constructor privado para evitar modificaciones directas desde el exterior." },
        { line: 15, text: "Método de fábrica estático como punto de entrada para crear instancias." },
        { line: 20, text: "Métodos de acceso de solo lectura para obtener los datos." },
        { line: 23, text: "Métodos que 'modifican' el objeto creando una nueva instancia en vez de alterar la actual." },
        { line: 40, text: "Definición de una colección inmutable genérica." },
        { line: 42, text: "Uso de un puntero compartido para almacenar los datos internamente." },
        { line: 54, text: "Métodos de acceso que permiten consultar pero no modificar los datos." },
        { line: 58, text: "Método para agregar elementos creando una nueva instancia de la colección." },
        { line: 64, text: "Método para eliminar elementos creando una nueva instancia." },
        { line: 71, text: "Método para transformar elementos aplicando una función a cada uno, retornando una nueva colección." },
        { line: 87, text: "Demostración de cómo los objetos originales permanecen sin cambios tras las 'modificaciones'." },
        { line: 94, text: "Creación de diferentes versiones de la colección, cada una como una nueva instancia." }
      ]
    },
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <string_view>
#include <vector>
#include <map>
#include <functional>
#include <memory>
#include <optional>
#include <variant>

// Tipos de valores inmutables usando std::variant como unión discriminada
using Value = std::variant<int, double, std::string, bool>;

// Clase inmutable para representar un objeto JSON-like
class ImmutableObject {
private:
    std::shared_ptr<std::map<std::string, Value>> data;
    
    // Constructor privado con datos existentes
    explicit ImmutableObject(std::shared_ptr<std::map<std::string, Value>> data) 
        : data(std::move(data)) {}
        
public:
    // Constructor público por defecto
    ImmutableObject() : data(std::make_shared<std::map<std::string, Value>>()) {}
    
    // Métodos para acceder a propiedades
    std::optional<Value> get(std::string_view key) const {
        auto it = data->find(std::string(key));
        if (it != data->end()) {
            return it->second;
        }
        return std::nullopt;
    }
    
    // Comprueba si existe una clave
    bool has(std::string_view key) const {
        return data->find(std::string(key)) != data->end();
    }
    
    // Método para "establecer" propiedades (creando un nuevo objeto)
    ImmutableObject set(std::string_view key, Value value) const {
        auto newData = std::make_shared<std::map<std::string, Value>>(*data);
        (*newData)[std::string(key)] = std::move(value);
        return ImmutableObject(newData);
    }
    
    // Método para "eliminar" propiedades (creando un nuevo objeto)
    ImmutableObject remove(std::string_view key) const {
        auto newData = std::make_shared<std::map<std::string, Value>>(*data);
        newData->erase(std::string(key));
        return ImmutableObject(newData);
    }
    
    // Método para "actualizar" propiedades basándose en su valor actual
    ImmutableObject update(std::string_view key, 
                          std::function<Value(const Value&)> updater) const {
        auto it = data->find(std::string(key));
        if (it != data->end()) {
            auto newData = std::make_shared<std::map<std::string, Value>>(*data);
            (*newData)[std::string(key)] = updater(it->second);
            return ImmutableObject(newData);
        }
        return *this;
    }
    
    // Métodos para iterar sobre las propiedades
    void forEach(std::function<void(const std::string&, const Value&)> callback) const {
        for (const auto& [key, value] : *data) {
            callback(key, value);
        }
    }
    
    // Método para transformar el objeto
    ImmutableObject map(std::function<Value(const std::string&, const Value&)> transformer) const {
        auto newData = std::make_shared<std::map<std::string, Value>>();
        for (const auto& [key, value] : *data) {
            (*newData)[key] = transformer(key, value);
        }
        return ImmutableObject(newData);
    }
    
    // Método para imprimir para depuración
    void print() const {
        std::cout << "{ ";
        bool first = true;
        forEach([&first](const std::string& key, const Value& val) {
            if (!first) std::cout << ", ";
            first = false;
            std::cout << key << ": ";
            std::visit([](const auto& v) {
                using T = std::decay_t<decltype(v)>;
                if constexpr (std::is_same_v<T, std::string>)
                    std::cout << "\"" << v << "\"";
                else
                    std::cout << v;
            }, val);
        });
        std::cout << " }" << std::endl;
    }
};

// Clase de utilidad para construir de forma fluida objetos inmutables
class ImmutableObjectBuilder {
private:
    ImmutableObject obj;
    
public:
    ImmutableObjectBuilder() = default;
    
    ImmutableObjectBuilder& with(std::string_view key, Value value) {
        obj = obj.set(key, std::move(value));
        return *this;
    }
    
    ImmutableObject build() {
        return obj;
    }
};

int main() {
    // Uso básico de objeto inmutable
    auto person = ImmutableObject()
        .set("name", std::string("Ana"))
        .set("age", 28)
        .set("active", true);
    
    person.print();
    
    // Modificación que crea un nuevo objeto
    auto updatedPerson = person
        .set("age", 29)
        .set("department", std::string("Ingeniería"));
    
    updatedPerson.print();
    
    // El objeto original permanece sin cambios
    person.print();
    
    // Uso del builder para crear un objeto de forma fluida
    auto company = ImmutableObjectBuilder()
        .with("name", std::string("TechCorp"))
        .with("employees", 500)
        .with("location", std::string("Madrid"))
        .build();
    
    company.print();
    
    // Transformación de valores existentes
    auto updatedCompany = company.update("employees", [](const Value& v) {
        return std::get<int>(v) + 50; // Incrementar en 50
    });
    
    updatedCompany.print();
    
    // Transformación completa del objeto
    auto formattedCompany = company.map([](const std::string& key, const Value& val) -> Value {
        if (std::holds_alternative<std::string>(val)) {
            std::string str = std::get<std::string>(val);
            std::transform(str.begin(), str.end(), str.begin(), ::toupper);
            return str;
        }
        return val;
    });
    
    formattedCompany.print();
    
    return 0;
}`,
      explanation: [
        { line: 11, text: "Definición de un tipo de valor variante que puede contener distintos tipos primitivos." },
        { line: 14, text: "Clase inmutable que representa un objeto similar a JSON con pares clave-valor." },
        { line: 16, text: "Uso de shared_ptr para almacenar los datos internos y facilitar la compartición eficiente." },
        { line: 26, text: "Métodos de acceso que devuelven valores opcionales, siguiendo el patrón moderno de C++." },
        { line: 39, text: "Método para 'establecer' un valor que realmente crea y devuelve un nuevo objeto." },
        { line: 46, text: "Método para 'eliminar' una propiedad, también creando un nuevo objeto." },
        { line: 53, text: "Método para 'actualizar' un valor aplicando una función al valor actual." },
        { line: 65, text: "Método para iterar sobre las propiedades usando callbacks modernos." },
        { line: 71, text: "Transformación completa del objeto aplicando una función a cada par clave-valor." },
        { line: 86, text: "Uso de std::visit para manejar los diferentes tipos en la variante al imprimir." },
        { line: 101, text: "Builder fluido que facilita la creación de objetos inmutables con múltiples propiedades." },
        { line: 115, text: "Demostración de cómo crear objetos inmutables encadenando métodos." },
        { line: 122, text: "Muestra que las 'modificaciones' realmente crean nuevos objetos." },
        { line: 139, text: "Transformación de valores específicos usando funciones lambda." },
        { line: 145, text: "Transformación de todo el objeto usando funciones de orden superior." }
      ]
    },
    java: {
      code: `import java.util.*;
import java.util.function.Function;
import java.util.function.UnaryOperator;
import java.util.stream.Collectors;

// Clase base para objetos inmutables
public class ImmutableExample {
    
    // Clase inmutable que representa una persona
    public static final class Person {
        private final String name;
        private final int age;
        private final Address address;
        
        // Constructor completo
        public Person(String name, int age, Address address) {
            this.name = name;
            this.age = age;
            this.address = address;
        }
        
        // Getters - sin setters para mantener inmutabilidad
        public String getName() { return name; }
        public int getAge() { return age; }
        public Address getAddress() { return address; }
        
        // Métodos para "modificar" creando nuevas instancias
        public Person withName(String newName) {
            return new Person(newName, age, address);
        }
        
        public Person withAge(int newAge) {
            return new Person(name, newAge, address);
        }
        
        public Person withAddress(Address newAddress) {
            return new Person(name, age, newAddress);
        }
        
        // Método para actualizar la dirección de forma más conveniente
        public Person withUpdatedAddress(UnaryOperator<Address> updater) {
            return new Person(name, age, updater.apply(address));
        }
        
        @Override
        public String toString() {
            return "Person{name='" + name + "', age=" + age + ", address=" + address + "}";
        }
        
        // Implementación adecuada de equals y hashCode para objetos inmutables
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Person person = (Person) o;
            return age == person.age && 
                   Objects.equals(name, person.name) && 
                   Objects.equals(address, person.address);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(name, age, address);
        }
    }
    
    // Clase inmutable de dirección
    public static final class Address {
        private final String street;
        private final String city;
        private final String zipCode;
        
        public Address(String street, String city, String zipCode) {
            this.street = street;
            this.city = city;
            this.zipCode = zipCode;
        }
        
        // Getters
        public String getStreet() { return street; }
        public String getCity() { return city; }
        public String getZipCode() { return zipCode; }
        
        // Métodos "modificadores"
        public Address withStreet(String newStreet) {
            return new Address(newStreet, city, zipCode);
        }
        
        public Address withCity(String newCity) {
            return new Address(street, newCity, zipCode);
        }
        
        public Address withZipCode(String newZipCode) {
            return new Address(street, city, newZipCode);
        }
        
        @Override
        public String toString() {
            return "Address{street='" + street + "', city='" + city + "', zipCode='" + zipCode + "'}";
        }
        
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Address address = (Address) o;
            return Objects.equals(street, address.street) && 
                   Objects.equals(city, address.city) && 
                   Objects.equals(zipCode, address.zipCode);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(street, city, zipCode);
        }
    }
    
    // Clase para lista inmutable
    public static final class ImmutableList<T> {
        private final List<T> elements;
        
        @SafeVarargs
        public ImmutableList(T... elements) {
            this.elements = Collections.unmodifiableList(Arrays.asList(elements));
        }
        
        private ImmutableList(List<T> elements) {
            this.elements = Collections.unmodifiableList(new ArrayList<>(elements));
        }
        
        // Métodos de acceso
        public T get(int index) {
            return elements.get(index);
        }
        
        public int size() {
            return elements.size();
        }
        
        public boolean isEmpty() {
            return elements.isEmpty();
        }
        
        // Métodos "modificadores"
        public ImmutableList<T> add(T element) {
            List<T> newList = new ArrayList<>(elements);
            newList.add(element);
            return new ImmutableList<>(newList);
        }
        
        public ImmutableList<T> remove(int index) {
            List<T> newList = new ArrayList<>(elements);
            newList.remove(index);
            return new ImmutableList<>(newList);
        }
        
        public <R> ImmutableList<R> map(Function<? super T, ? extends R> mapper) {
            List<R> newList = elements.stream()
                                      .map(mapper)
                                      .collect(Collectors.toList());
            return new ImmutableList<>(newList);
        }
        
        // Métodos para recorrer la lista
        public void forEach(java.util.function.Consumer<? super T> action) {
            elements.forEach(action);
        }
        
        @Override
        public String toString() {
            return elements.toString();
        }
    }
    
    public static void main(String[] args) {
        // Uso básico de objetos inmutables
        Address address = new Address("Calle Principal 123", "Barcelona", "08001");
        Person person = new Person("Juan", 35, address);
        
        System.out.println("Original: " + person);
        
        // "Modificación" que crea un nuevo objeto
        Person olderPerson = person.withAge(36);
        System.out.println("Modificado: " + olderPerson);
        
        // El objeto original permanece sin cambios
        System.out.println("Original sin cambios: " + person);
        
        // Actualización compleja usando un operador funcional
        Person movedPerson = person.withUpdatedAddress(addr -> 
            addr.withStreet("Avenida Diagonal 456").withCity("Madrid").withZipCode("28001")
        );
        
        System.out.println("Con nueva dirección: " + movedPerson);
        
        // Uso de lista inmutable
        ImmutableList<Integer> numbers = new ImmutableList<>(1, 2, 3, 4, 5);
        
        ImmutableList<Integer> moreNumbers = numbers.add(6);
        ImmutableList<Integer> lessNumbers = numbers.remove(2);
        ImmutableList<String> numberStrings = numbers.map(n -> "Número " + n);
        
        System.out.println("Lista original: " + numbers);
        System.out.println("Con elemento añadido: " + moreNumbers);
        System.out.println("Con elemento eliminado: " + lessNumbers);
        System.out.println("Transformada a strings: " + numberStrings);
    }
}`,
      explanation: [
        { line: 8, text: "Definición de una clase inmutable que representa a una persona." },
        { line: 14, text: "Constructor que inicializa todos los campos finales (inmutables)." },
        { line: 21, text: "Solo se proporcionan getters, no hay setters para preservar la inmutabilidad." },
        { line: 26, text: "Métodos para 'modificar' que realmente crean nuevas instancias." },
        { line: 38, text: "Método que permite actualizaciones complejas usando funciones." },
        { line: 47, text: "Implementación correcta de equals para comparar objetos inmutables por valor." },
        { line: 59, text: "Implementación correcta de hashCode para consistencia con equals." },
        { line: 64, text: "Clase inmutable anidada para representar direcciones." },
        { line: 102, text: "Clase para lista inmutable genérica que encapsula una lista estándar." },
        { line: 106, text: "Constructor varargs para crear listas fácilmente." },
        { line: 110, text: "Constructor privado que hace una copia defensiva de la lista para garantizar inmutabilidad." },
        { line: 127, text: "Métodos 'modificadores' que devuelven nuevas instancias de la lista." },
        { line: 140, text: "Método para transformar la lista usando funciones, devolviendo una nueva lista." },
        { line: 160, text: "Demostración de cómo usar objetos inmutables." },
        { line: 171, text: "Actualización compleja usando composición funcional." },
        { line: 179, text: "Operaciones con listas inmutables donde cada operación produce una nueva lista." }
      ]
    }
  },
  comparisons: [
    {
      title: 'Implementación de la Inmutabilidad',
      cppTraditional: 'Mediante campos const y funciones que devuelven nuevas instancias, con std::shared_ptr para gestión de memoria.',
      cppModern: 'Uso avanzado de smart pointers, std::variant, y técnicas de compartición estructural para eficiencia.',
      java: 'A través de campos final, ausencia de setters, y métodos "with" que devuelven nuevas instancias.'
    },
    {
      title: 'Eficiencia en Memoria',
      cppTraditional: 'Copia completa de datos, puede ser ineficiente para estructuras grandes.',
      cppModern: 'Compartición estructural mediante punteros compartidos, minimizando copias profundas.',
      java: 'Depende de la implementación; generalmente implica copias completas aunque las colecciones usan técnicas de optimización.'
    },
    {
      title: 'Soporte del Lenguaje',
      cppTraditional: 'Limitado, requiere disciplina del programador.',
      cppModern: 'Mejorado con características como const, move semantics y value categories.',
      java: 'Razonable con final, pero sin soporte específico para estructuras de datos persistentes.'
    },
    {
      title: 'Uso en APIs',
      cppTraditional: 'Generalmente explícito mediante convenciones de nomenclatura.',
      cppModern: 'Más integrado con las convenciones modernas de C++.',
      java: 'Bien establecido en bibliotecas modernas como la API de Stream y bibliotecas funcionales.'
    }
  ],
  notes: 'La inmutabilidad es un concepto fundamental en programación funcional que está ganando adopción en paradigmas imperativos y orientados a objetos. Proporciona beneficios significativos para la concurrencia, depuración y razonamiento sobre el código, pero requiere un cambio en la mentalidad de desarrollo. En aplicaciones de alto rendimiento, es importante considerar optimizaciones como la compartición estructural para evitar copias innecesarias. Bibliotecas como Immutable.js para JavaScript o Vavr para Java facilitan el uso de estructuras de datos inmutables con implementaciones eficientes. En C++, la sobrecarga de operadores puede hacer que el código con objetos inmutables sea más expresivo, mientras que en Java, los patrones de diseño como el Builder pueden ayudar a crear objetos inmutables complejos de manera más conveniente.'
};

export default immutabilityPattern; 
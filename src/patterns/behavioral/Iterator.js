const iteratorPattern = {
  id: 'iterator',
  name: 'Iterator',
  category: 'behavioral',
  description: 'Proporciona una forma de acceder secuencialmente a los elementos de una colección sin exponer su representación subyacente. Permite recorrer diferentes estructuras de datos de manera uniforme sin revelar sus detalles internos.',
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <vector>
#include <string>

// Declaración adelantada
class Iterator;
class ConcreteIterator;

// Interfaz de colección
class Aggregate {
public:
    virtual ~Aggregate() {}
    virtual Iterator* createIterator() = 0;
    virtual int getSize() const = 0;
    virtual int getItem(int index) const = 0;
    virtual void addItem(int item) = 0;
};

// Interfaz de iterador
class Iterator {
public:
    virtual ~Iterator() {}
    virtual void first() = 0;
    virtual void next() = 0;
    virtual bool isDone() const = 0;
    virtual int currentItem() const = 0;
};

// Colección concreta
class ConcreteAggregate : public Aggregate {
private:
    std::vector<int> items;

public:
    Iterator* createIterator() override;
    
    int getSize() const override {
        return items.size();
    }
    
    int getItem(int index) const override {
        return items[index];
    }
    
    void addItem(int item) override {
        items.push_back(item);
    }
};

// Iterador concreto
class ConcreteIterator : public Iterator {
private:
    const ConcreteAggregate* aggregate;
    int current;

public:
    ConcreteIterator(const ConcreteAggregate* a) : aggregate(a), current(0) {}
    
    void first() override {
        current = 0;
    }
    
    void next() override {
        current++;
    }
    
    bool isDone() const override {
        return current >= aggregate->getSize();
    }
    
    int currentItem() const override {
        if (isDone()) {
            throw std::out_of_range("Iterador fuera de rango");
        }
        return aggregate->getItem(current);
    }
};

// Implementación del método createIterator de ConcreteAggregate
Iterator* ConcreteAggregate::createIterator() {
    return new ConcreteIterator(this);
}

// Función cliente que utiliza el iterador
void printCollection(Iterator* it) {
    std::cout << "Elementos de la colección: ";
    for (it->first(); !it->isDone(); it->next()) {
        std::cout << it->currentItem() << " ";
    }
    std::cout << std::endl;
}

// Cliente
int main() {
    ConcreteAggregate collection;
    
    collection.addItem(10);
    collection.addItem(20);
    collection.addItem(30);
    collection.addItem(40);
    collection.addItem(50);
    
    Iterator* it = collection.createIterator();
    printCollection(it);
    
    delete it;
    
    return 0;
}`,
      explanation: [
        { line: 9, text: 'La interfaz Aggregate define métodos para crear iteradores y manipular colecciones.' },
        { line: 12, text: 'El método createIterator es esencial pues devuelve un iterador para esta colección.' },
        { line: 19, text: 'La interfaz Iterator declara operaciones para acceder y recorrer elementos.' },
        { line: 21, text: 'first() posiciona el iterador en el primer elemento.' },
        { line: 22, text: 'next() avanza el iterador al siguiente elemento.' },
        { line: 23, text: 'isDone() verifica si el iterador ha llegado al final de la colección.' },
        { line: 24, text: 'currentItem() devuelve el elemento actual donde está el iterador.' },
        { line: 29, text: 'ConcreteAggregate implementa la interfaz Aggregate utilizando un vector como almacenamiento interno.' },
        { line: 33, text: 'Implementaciones de los métodos de acceso y modificación de la colección.' },
        { line: 46, text: 'ConcreteIterator implementa la interfaz Iterator para la ConcreteAggregate específica.' },
        { line: 48, text: 'Mantiene una referencia a la colección y la posición actual.' },
        { line: 51, text: 'El constructor inicializa el iterador con la colección a iterar y la posición inicial.' },
        { line: 60, text: 'isDone() verifica si hemos llegado al final de la colección.' },
        { line: 64, text: 'currentItem() lanza una excepción si intentamos acceder más allá del final.' },
        { line: 74, text: 'createIterator instancia un ConcreteIterator para esta colección.' },
        { line: 79, text: 'La función printCollection muestra cómo usar un iterador para recorrer una colección.' },
        { line: 81, text: 'Bucle estándar con iterador: inicializar, verificar si terminó, y avanzar.' },
        { line: 90, text: 'Creamos una colección y añadimos elementos.' },
        { line: 97, text: 'Obtenemos un iterador y lo usamos para imprimir la colección.' },
        { line: 99, text: 'Importante: debemos liberar la memoria del iterador cuando ya no lo necesitamos.' }
      ]
    },
    
    cppModern: {
      code: `#include <iostream>
#include <vector>
#include <memory>
#include <string>
#include <iterator>
#include <algorithm>

// Ejemplo de colección genérica con soporte de iteración
template <typename T>
class Collection {
private:
    std::vector<T> elements;

public:
    // Declaración de tipos de iteradores para compatibilidad con STL
    using iterator = typename std::vector<T>::iterator;
    using const_iterator = typename std::vector<T>::const_iterator;
    
    // Métodos para añadir elementos
    void add(const T& element) {
        elements.push_back(element);
    }
    
    // Métodos para acceder a los iteradores
    iterator begin() {
        return elements.begin();
    }
    
    iterator end() {
        return elements.end();
    }
    
    const_iterator begin() const {
        return elements.begin();
    }
    
    const_iterator end() const {
        return elements.end();
    }
    
    // Método para obtener el tamaño
    size_t size() const {
        return elements.size();
    }
    
    // Operador de subíndice para acceso directo
    T& operator[](size_t index) {
        return elements[index];
    }
    
    const T& operator[](size_t index) const {
        return elements[index];
    }
};

// Ejemplo de producto para usar con nuestra colección
class Product {
private:
    std::string name;
    double price;

public:
    Product(const std::string& n, double p) : name(n), price(p) {}
    
    const std::string& getName() const {
        return name;
    }
    
    double getPrice() const {
        return price;
    }
    
    void setPrice(double newPrice) {
        price = newPrice;
    }
    
    friend std::ostream& operator<<(std::ostream& os, const Product& product) {
        os << "Producto: " << product.name << ", Precio: $" << product.price;
        return os;
    }
};

// Implementación de un iterador personalizado para filtrar elementos
template <typename Iterator, typename Predicate>
class FilterIterator {
private:
    Iterator current;
    Iterator end;
    Predicate pred;

public:
    // Tipos necesarios para comportarse como un iterador de STL
    using value_type = typename std::iterator_traits<Iterator>::value_type;
    using difference_type = typename std::iterator_traits<Iterator>::difference_type;
    using pointer = typename std::iterator_traits<Iterator>::pointer;
    using reference = typename std::iterator_traits<Iterator>::reference;
    using iterator_category = std::forward_iterator_tag;
    
    // Constructor
    FilterIterator(Iterator begin, Iterator end, Predicate p)
        : current(begin), end(end), pred(p) {
        // Avanzar hasta encontrar el primer elemento que cumple con el predicado
        while (current != end && !pred(*current)) {
            ++current;
        }
    }
    
    // Operadores necesarios para un iterador
    reference operator*() const {
        return *current;
    }
    
    pointer operator->() const {
        return &(*current);
    }
    
    FilterIterator& operator++() {
        // Avanzar al siguiente elemento que cumple con el predicado
        if (current != end) {
            ++current;
            while (current != end && !pred(*current)) {
                ++current;
            }
        }
        return *this;
    }
    
    FilterIterator operator++(int) {
        FilterIterator temp = *this;
        ++(*this);
        return temp;
    }
    
    bool operator==(const FilterIterator& other) const {
        return current == other.current;
    }
    
    bool operator!=(const FilterIterator& other) const {
        return !(*this == other);
    }
};

// Función auxiliar para crear filter iterators
template <typename Iterator, typename Predicate>
FilterIterator<Iterator, Predicate> makeFilterIterator(Iterator begin, Iterator end, Predicate pred) {
    return FilterIterator<Iterator, Predicate>(begin, end, pred);
}

// Demostración del patrón Iterator
int main() {
    // Crear una colección de productos
    Collection<Product> inventory;
    
    // Añadir productos
    inventory.add(Product("Laptop", 1200.00));
    inventory.add(Product("Smartphone", 800.00));
    inventory.add(Product("Tablet", 300.00));
    inventory.add(Product("Auriculares", 150.00));
    inventory.add(Product("Monitor", 250.00));
    
    std::cout << "Todos los productos:" << std::endl;
    for (const auto& product : inventory) {
        std::cout << "- " << product << std::endl;
    }
    
    // Uso de algoritmos de STL con nuestros iteradores
    std::cout << "\\nProducto más caro:" << std::endl;
    auto maxPriceIt = std::max_element(inventory.begin(), inventory.end(),
        [](const Product& a, const Product& b) {
            return a.getPrice() < b.getPrice();
        });
    
    if (maxPriceIt != inventory.end()) {
        std::cout << "- " << *maxPriceIt << std::endl;
    }
    
    // Filtrar productos usando nuestro iterador personalizado
    std::cout << "\\nProductos con precio mayor a $200:" << std::endl;
    
    auto beginFiltered = makeFilterIterator(inventory.begin(), inventory.end(),
        [](const Product& p) { return p.getPrice() > 200.0; });
    
    auto endFiltered = makeFilterIterator(inventory.end(), inventory.end(),
        [](const Product& p) { return p.getPrice() > 200.0; });
    
    for (auto it = beginFiltered; it != endFiltered; ++it) {
        std::cout << "- " << *it << std::endl;
    }
    
    // Otra forma de iterar con nuestro iterador utilizando un rango
    std::cout << "\\nProductos con nombre que comienza con 'M':" << std::endl;
    
    auto beginNameFiltered = makeFilterIterator(inventory.begin(), inventory.end(),
        [](const Product& p) { return p.getName().front() == 'M'; });
    
    auto endNameFiltered = makeFilterIterator(inventory.end(), inventory.end(),
        [](const Product& p) { return p.getName().front() == 'M'; });
    
    for (auto it = beginNameFiltered; it != endNameFiltered; ++it) {
        std::cout << "- " << *it << std::endl;
    }
    
    return 0;
}`,
      explanation: [
        { line: 9, text: 'Definimos una clase Collection genérica usando templates para almacenar cualquier tipo de elemento.' },
        { line: 14, text: 'Declaramos tipos de iteradores compatibles con la STL para poder usar algoritmos estándar.' },
        { line: 23, text: 'Implementamos métodos begin() y end() que devuelven iteradores estándar de STL.' },
        { line: 45, text: 'La clase Product representa un producto en nuestro inventario, con nombre y precio.' },
        { line: 66, text: 'Sobrecargamos el operador << para facilitar la impresión de productos.' },
        { line: 72, text: 'FilterIterator es un iterador personalizado que filtra elementos basados en un predicado.' },
        { line: 79, text: 'Definimos los tipos necesarios para que nuestro iterador sea compatible con los algoritmos de STL.' },
        { line: 87, text: 'El constructor inicializa el iterador y avanza hasta el primer elemento que cumple el predicado.' },
        { line: 99, text: 'Implementamos el operador ++ para avanzar al siguiente elemento que cumple el predicado.' },
        { line: 123, text: 'makeFilterIterator es una función auxiliar para crear iteradores de filtro de forma más sencilla.' },
        { line: 131, text: 'Creamos un inventario de productos usando nuestra clase Collection.' },
        { line: 140, text: 'Usamos un bucle for basado en rango para iterar todos los productos, posible gracias a begin() y end().' },
        { line: 145, text: 'Usamos el algoritmo max_element de STL con nuestros iteradores y una función lambda como predicado.' },
        { line: 154, text: 'Creamos iteradores de filtro para mostrar solo productos con precio mayor a $200.' },
        { line: 161, text: 'Iteramos usando los iteradores de filtro personalizados.' },
        { line: 176, text: 'Otro ejemplo con un predicado diferente: filtrando por la primera letra del nombre.' }
      ]
    },
    
    java: {
      code: `import java.util.*;
import java.util.function.Predicate;

// Interfaz para iterador
interface Iterator<T> {
    boolean hasNext();
    T next();
}

// Interfaz para colección iterable
interface IterableCollection<T> {
    Iterator<T> createIterator();
}

// Implementación concreta de una colección
class BookCollection implements IterableCollection<Book> {
    private List<Book> books = new ArrayList<>();
    
    public void addBook(Book book) {
        books.add(book);
    }
    
    public void removeBook(Book book) {
        books.remove(book);
    }
    
    public List<Book> getBooks() {
        return books;
    }
    
    @Override
    public Iterator<Book> createIterator() {
        return new BookIterator();
    }
    
    // Iterador para la colección de libros
    private class BookIterator implements Iterator<Book> {
        private int currentIndex = 0;
        
        @Override
        public boolean hasNext() {
            return currentIndex < books.size();
        }
        
        @Override
        public Book next() {
            if (!hasNext()) {
                throw new NoSuchElementException();
            }
            return books.get(currentIndex++);
        }
    }
    
    // Creación de un iterador filtrado
    public Iterator<Book> createFilteredIterator(Predicate<Book> filter) {
        return new FilteredBookIterator(filter);
    }
    
    // Iterador filtrado para libros
    private class FilteredBookIterator implements Iterator<Book> {
        private int currentIndex = 0;
        private Predicate<Book> filter;
        private Book nextBook = null;
        
        public FilteredBookIterator(Predicate<Book> filter) {
            this.filter = filter;
            findNext();
        }
        
        private void findNext() {
            while (currentIndex < books.size()) {
                Book book = books.get(currentIndex++);
                if (filter.test(book)) {
                    nextBook = book;
                    return;
                }
            }
            nextBook = null;
        }
        
        @Override
        public boolean hasNext() {
            return nextBook != null;
        }
        
        @Override
        public Book next() {
            if (!hasNext()) {
                throw new NoSuchElementException();
            }
            Book bookToReturn = nextBook;
            findNext();
            return bookToReturn;
        }
    }
}

// Clase Book para usar en nuestra colección
class Book {
    private String title;
    private String author;
    private int yearPublished;
    private String genre;
    private double price;
    
    public Book(String title, String author, int yearPublished, String genre, double price) {
        this.title = title;
        this.author = author;
        this.yearPublished = yearPublished;
        this.genre = genre;
        this.price = price;
    }
    
    // Getters
    public String getTitle() {
        return title;
    }
    
    public String getAuthor() {
        return author;
    }
    
    public int getYearPublished() {
        return yearPublished;
    }
    
    public String getGenre() {
        return genre;
    }
    
    public double getPrice() {
        return price;
    }
    
    @Override
    public String toString() {
        return title + " por " + author + " (" + yearPublished + ") - " + genre + " - $" + price;
    }
}

// Clase para demostrar el uso de iteradores
class BibliotecaService {
    private BookCollection biblioteca;
    
    public BibliotecaService() {
        biblioteca = new BookCollection();
        inicializarBiblioteca();
    }
    
    private void inicializarBiblioteca() {
        biblioteca.addBook(new Book("Cien años de soledad", "Gabriel García Márquez", 1967, "Ficción", 25.99));
        biblioteca.addBook(new Book("El señor de los anillos", "J.R.R. Tolkien", 1954, "Fantasía", 35.50));
        biblioteca.addBook(new Book("El código Da Vinci", "Dan Brown", 2003, "Misterio", 19.99));
        biblioteca.addBook(new Book("1984", "George Orwell", 1949, "Ciencia ficción", 15.50));
        biblioteca.addBook(new Book("El principito", "Antoine de Saint-Exupéry", 1943, "Infantil", 12.99));
        biblioteca.addBook(new Book("Don Quijote de la Mancha", "Miguel de Cervantes", 1605, "Clásico", 30.00));
        biblioteca.addBook(new Book("Harry Potter y la piedra filosofal", "J.K. Rowling", 1997, "Fantasía", 24.99));
    }
    
    // Método que utiliza el iterador para mostrar todos los libros
    public void mostrarTodosLosLibros() {
        System.out.println("Lista completa de libros:");
        
        Iterator<Book> iterator = biblioteca.createIterator();
        while (iterator.hasNext()) {
            Book book = iterator.next();
            System.out.println("- " + book);
        }
    }
    
    // Método que utiliza un iterador filtrado para mostrar libros por género
    public void mostrarLibrosPorGenero(String genre) {
        System.out.println("\\nLibros del género " + genre + ":");
        
        Iterator<Book> filteredIterator = biblioteca.createFilteredIterator(book -> book.getGenre().equals(genre));
        while (filteredIterator.hasNext()) {
            Book book = filteredIterator.next();
            System.out.println("- " + book);
        }
    }
    
    // Método que utiliza un iterador filtrado para mostrar libros por rango de años
    public void mostrarLibrosPorRangoDeAños(int startYear, int endYear) {
        System.out.println("\\nLibros publicados entre " + startYear + " y " + endYear + ":");
        
        Iterator<Book> filteredIterator = biblioteca.createFilteredIterator(
            book -> book.getYearPublished() >= startYear && book.getYearPublished() <= endYear);
        
        while (filteredIterator.hasNext()) {
            Book book = filteredIterator.next();
            System.out.println("- " + book);
        }
    }
    
    // Método que utiliza un iterador filtrado para mostrar libros por precio
    public void mostrarLibrosPorPrecio(double maxPrice) {
        System.out.println("\\nLibros con precio menor o igual a $" + maxPrice + ":");
        
        Iterator<Book> filteredIterator = biblioteca.createFilteredIterator(book -> book.getPrice() <= maxPrice);
        while (filteredIterator.hasNext()) {
            Book book = filteredIterator.next();
            System.out.println("- " + book);
        }
    }
}

// Clase principal para demostrar el patrón Iterator
public class IteratorPatternDemo {
    public static void main(String[] args) {
        BibliotecaService biblioteca = new BibliotecaService();
        
        // Mostrar todos los libros
        biblioteca.mostrarTodosLosLibros();
        
        // Mostrar libros filtrados por género
        biblioteca.mostrarLibrosPorGenero("Fantasía");
        
        // Mostrar libros filtrados por rango de años
        biblioteca.mostrarLibrosPorRangoDeAños(1950, 2000);
        
        // Mostrar libros filtrados por precio
        biblioteca.mostrarLibrosPorPrecio(20.00);
    }
}`,
      explanation: [
        { line: 5, text: 'La interfaz Iterator declara los métodos necesarios para iterar una colección.' },
        { line: 10, text: 'La interfaz IterableCollection declara un método para crear iteradores.' },
        { line: 15, text: 'BookCollection es una implementación concreta de una colección iterable que almacena libros.' },
        { line: 29, text: 'El método createIterator devuelve un iterador para recorrer los libros.' },
        { line: 34, text: 'BookIterator es una implementación concreta del iterador para la colección de libros.' },
        { line: 37, text: 'hasNext() verifica si hay más elementos para iterar.' },
        { line: 42, text: 'next() devuelve el elemento actual y avanza el iterador.' },
        { line: 50, text: 'Método para crear un iterador filtrado basado en un predicado.' },
        { line: 55, text: 'FilteredBookIterator es un iterador especializado que sólo devuelve libros que cumplen un predicado.' },
        { line: 64, text: 'findNext() busca el siguiente libro que cumple con el filtro.' },
        { line: 89, text: 'La clase Book representa un libro con sus atributos.' },
        { line: 125, text: 'La clase BibliotecaService demuestra cómo usar los iteradores.' },
        { line: 130, text: 'inicializarBiblioteca() crea una colección de libros de ejemplo.' },
        { line: 142, text: 'mostrarTodosLosLibros() utiliza el iterador estándar para mostrar todos los libros.' },
        { line: 152, text: 'mostrarLibrosPorGenero() utiliza un iterador filtrado para mostrar libros de un género específico.' },
        { line: 162, text: 'mostrarLibrosPorRangoDeAños() muestra libros publicados en un rango de años específico.' },
        { line: 186, text: 'La clase IteratorPatternDemo contiene el método main que demuestra el uso del patrón Iterator.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Enfoque de implementación',
      cppTraditional: 'Implementación básica del patrón con interfaces explícitas Iterator y Aggregate, utilizando punteros crudos que requieren gestión manual de memoria.',
      cppModern: 'Aprovecha las capacidades de la STL y C++11 con templates, compatibilidad con algoritmos estándar, y soporte para iteradores personalizados usando traits.',
      java: 'Implementa el patrón con interfaces propias y aprovecha características de Java como clases internas e implementación de Predicate para filtrado flexible.'
    },
    {
      title: 'Gestión de memoria',
      cppTraditional: 'Requiere gestión manual de memoria con delete para liberar los iteradores creados, lo que puede llevar a fugas de memoria si no se maneja correctamente.',
      cppModern: 'No requiere gestión manual de memoria gracias al uso de contenedores STL y referencias, eliminando el riesgo de fugas de memoria.',
      java: 'La gestión de memoria es automática gracias al recolector de basura de Java, simplificando el código y evitando problemas de memoria.'
    },
    {
      title: 'Caso de uso práctico',
      cppTraditional: 'Ejemplo básico que muestra la estructura del patrón con una colección de enteros simples.',
      cppModern: 'Implementación avanzada de un sistema de inventario con productos y capacidades de filtrado, mostrando integración con la STL.',
      java: 'Sistema de biblioteca completo con múltiples criterios de filtrado, demostrando el uso práctico del patrón en una aplicación real.'
    }
  ],
  
  theory: {
    background: 'El patrón Iterator fue formalizado por la Banda de los Cuatro (GoF) y se inspira en los conceptos de cursores de bases de datos y recorrido de estructuras. Es uno de los patrones más utilizados en programación moderna, ya que sirve como base para las construcciones de iteración integradas en muchos lenguajes como los loops foreach y los generadores.',
    
    problem: 'Cuando trabajamos con colecciones de objetos (listas, árboles, grafos, etc.), necesitamos un método para acceder a sus elementos sin exponer la estructura interna. Diferentes colecciones pueden tener diferentes estructuras internas, lo que complica recorrerlas de manera uniforme. Además, a veces necesitamos múltiples formas de recorrer la misma colección o mantener múltiples iteradores simultáneos sobre la misma estructura.',
    
    solution: 'El patrón Iterator proporciona una interfaz unificada para recorrer diferentes colecciones. Extrae la responsabilidad de acceso y recorrido de la colección y la coloca en un objeto iterador, que encapsula los detalles de navegación por la estructura. La colección proporciona un método para crear un iterador, y el cliente utiliza este iterador para acceder secuencialmente a los elementos sin conocer los detalles internos de la colección.',
    
    applicability: [
      'Cuando necesitas acceder al contenido de una colección sin exponer su representación interna',
      'Para proporcionar una interfaz uniforme para recorrer diferentes estructuras de datos',
      'Cuando quieres soportar múltiples recorridos de la misma colección simultáneamente',
      'Para desacoplar los algoritmos de las estructuras de datos sobre las que operan',
      'Cuando necesitas diferentes tipos de recorrido para una colección (por ejemplo, en orden, en preorden, filtrado)',
      'Para simplificar la interfaz de una colección encapsulando la complejidad de la iteración'
    ],
    
    consequences: [
      'Simplifica la interfaz de la colección al mover la responsabilidad de iteración a otra clase',
      'Soporta múltiples tipos de iteración sobre la misma colección y múltiples iteradores concurrentes',
      'Permite iterar sobre diferentes colecciones de manera uniforme con una interfaz común',
      'Elimina la duplicación de código de iteración a través de diferentes partes de la aplicación',
      'Aplica el principio de responsabilidad única al separar la iteración de las operaciones de la colección',
      'Puede introducir clases adicionales, aumentando la complejidad para colecciones simples',
      'En algunos casos, usar iteradores puede ser menos eficiente que acceder directamente a elementos',
      'Puede ser difícil mantener múltiples iteradores sincronizados si la colección subyacente cambia',
      'En lenguajes con sintaxis de iteración integrada, implementar manualmente iteradores puede resultar redundante',
      'La implementación de iteradores recursivos (por ejemplo, para árboles) puede ser compleja y propensa a errores'
    ],
    
    notes: `
      <h3>¿Cuándo DEBES usar el patrón Iterator?</h3>
      <ul>
        <li><strong>Colecciones complejas:</strong> Cuando trabajas con estructuras de datos complejas como árboles, grafos o matrices multidimensionales.</li>
        <li><strong>Múltiples recorridos:</strong> Cuando necesitas diferentes maneras de recorrer una colección (por orden, por niveles, filtrado, etc.).</li>
        <li><strong>Interfaz unificada:</strong> Para proporcionar una manera consistente de acceder a elementos de diferentes tipos de colecciones.</li>
        <li><strong>Procesamiento de stream:</strong> Cuando necesitas procesar elementos de forma perezosa o uno por uno sin cargar toda la colección.</li>
        <li><strong>Ocultación de detalles:</strong> Para evitar exponer los detalles internos de una estructura de datos compleja.</li>
        <li><strong>Algoritmos genéricos:</strong> Cuando implementas algoritmos que funcionan con cualquier tipo de colección.</li>
      </ul>
      
      <h3>Variantes del patrón Iterator:</h3>
      <ul>
        <li><strong>Iterator externo:</strong> La forma clásica donde el cliente controla explícitamente la iteración llamando a métodos next().</li>
        <li><strong>Iterator interno:</strong> Donde la colección maneja la iteración y llama a una función proporcionada por el cliente para cada elemento.</li>
        <li><strong>Iterator bidireccional:</strong> Soporta navegación en ambos sentidos con métodos previous() y next().</li>
        <li><strong>Iterator filtrado:</strong> Solo devuelve elementos que cumplen ciertos criterios durante la iteración.</li>
        <li><strong>Iterator compuesto:</strong> Permite iterar sobre estructuras jerárquicas como si fueran una secuencia plana.</li>
        <li><strong>Iterator perezoso (lazy):</strong> Calcula los valores bajo demanda, útil para secuencias infinitas o cálculos costosos.</li>
        <li><strong>Iterator paralelo:</strong> Permite la iteración concurrente de múltiples elementos en entornos multihilo.</li>
      </ul>
      
      <h3>Ejemplos prácticos en aplicaciones reales:</h3>
      <ul>
        <li><strong>Bibliotecas estándar:</strong> Prácticamente todos los lenguajes modernos tienen iteradores para sus colecciones (STL en C++, java.util.Iterator, iterables en Python).</li>
        <li><strong>Base de datos:</strong> Los cursores en SQL son esencialmente iteradores sobre conjuntos de resultados.</li>
        <li><strong>Procesamiento de archivos:</strong> Recorrer líneas o registros en archivos grandes sin cargar todo el contenido en memoria.</li>
        <li><strong>Frameworks de UI:</strong> Para recorrer elementos visuales en una jerarquía de componentes.</li>
        <li><strong>Recorrido DOM:</strong> Navegadores que proporcionan iteradores para recorrer el árbol DOM de un documento HTML.</li>
        <li><strong>Streams de datos:</strong> En Java 8+ o .NET LINQ, donde las operaciones de filtrado, mapeo y reducción trabajan con streams iterables.</li>
        <li><strong>Paginación:</strong> Sistemas que muestran datos por páginas, donde cada página es una iteración sobre un conjunto más grande.</li>
        <li><strong>Generadores:</strong> En JavaScript, Python o C#, que son una forma de implementar iteradores con sintaxis simplificada.</li>
      </ul>
      
      <h3>Iterator vs Observer vs Visitor</h3>
      <ul>
        <li><strong>Iterator:</strong> Se enfoca en proporcionar acceso secuencial a elementos de una colección sin exponer su estructura interna. Es un patrón de acceso.</li>
        <li><strong>Observer:</strong> Define una dependencia uno-a-muchos entre objetos para notificación de cambios. Mientras Iterator accede a elementos, Observer notifica sobre cambios en estos elementos.</li>
        <li><strong>Visitor:</strong> Permite definir una nueva operación sin cambiar las clases de los elementos sobre los que opera. Iterator recorre una estructura, Visitor realiza operaciones mientras se recorre.</li>
      </ul>
    `
  }
};

export default iteratorPattern;

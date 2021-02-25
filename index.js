const dataCities = [
    { id: 1, in_stock: 1 },
    { id: 2, in_stock: 0 },
    { id: 3, in_stock: 1 },
];

const dataDistances = [
    { src_city_id: 1, dst_city_id: 2, distance: 15 },
    { src_city_id: 1, dst_city_id: 3, distance: 20 },
    { src_city_id: 2, dst_city_id: 1, distance: 15 },
];

const delivery = (cities, distances, target_id) => {
    // Проверяем есть ли город
    if (!cities.find(city => city.id === target_id)) {
        return false;
    }

    // Тут будет маршрут
    const route = [];

    // Проверяем есть ли товар в выбранном городе
    const currentCity = cities.find(city => city.id === target_id && city.in_stock > 0);
    
    // Если есть возвращаем его id без расстояния
    if (currentCity) {
        return currentCity.id;
    }

    // Узнаем id городов в которых товар есть в наличии 
    const productsInStock = cities.filter(city => city.in_stock > 0).map(city => city.id);
    // Если нет товара в наличии выходим из функции
    if (productsInStock.length === 0) {
        return false;
    }

    // Функция которая создает маршрут доставки
    const router = (productsInStock, id) => {
        // Функция которая находит самое короткое расстояне
        const smallestDistance = (arr) => {
            const smallestDistance = arr.map(e => e.distance).sort((a, b) => a - b)[0];
            return arr.find(item => item.distance === smallestDistance);
        }

        // Узнаем из какого горда можно доставить товар
        const withDelivery = distances.filter(city => city.dst_city_id === id);
        // Если нет доставки в этот город выходим из функции
        if (withDelivery.length === 0) {
            return false;
        }

        // Находим города с доставкой и товаром в наличии
        const productsAndDelivery = withDelivery.filter(item => productsInStock.indexOf(item.src_city_id) >= 0);

        // Если нет города из которого есть прямая доставка...
        if (productsAndDelivery.length === 0) {
            // находим город в котором есть доставка в город из которого товар можно доставить покупатель
            const id = smallestDistance(withDelivery).src_city_id;
            router(productsInStock, id);
            // Добовляем город в маршрут
            route.push(withDelivery[0]);
        } else {
            // Если есть города с прямой доставкой выбираем ближайший
            smallestDistance(productsAndDelivery);
            // Добовляем город в маршрут
            route.push(productsAndDelivery[0]);
        }
    }

    // Строим маршрут до нужного города
    router(productsInStock, target_id);

    if (route.length === 0) {
        return false;
    }

    return {
        id: route[0].src_city_id,
        distance: route.map(e => e.distance).reduce((a, b) => a + b),
        route,
    };
}

const response = delivery(dataCities, dataDistances, 2);
console.log(response);
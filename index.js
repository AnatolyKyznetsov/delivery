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
    // Есть ли город в базе
    const cityInBase = cities.some(city => city.id === target_id);

    if (!cityInBase) {
        return false;
    }

    // Есть ли товар в этом горде
    const currentCity = cities.find(city => city.id === target_id && city.in_stock > 0);

    if (currentCity) {
        return currentCity.id;
    }

    const shortcut = [];
    const route = [];

    // Собираем массив с которым будем работать
    cities.forEach(item => {
        shortcut.push({
            id: item.id, // идентификатор горда
            in_stock: item.in_stock, // количество товара в городе
            distance: item.id === target_id ? 0 : Infinity, // расстояние от города до цели
            is_checked: false, // проверен ли город
        });
    });

    // Помещаем целевой город на первое место в массиве
    shortcut.sort((a, b) => a.distance - b.distance);

    // Узнаем расстояние от цели до городов
    const findDistance = (target) => {
        // Находи соседние города в порядке увеличения пути
        const cityNeighbors = distances.filter(e => e.dst_city_id === target)
            .sort((a, b) => a.distance - b.distance);

        // Записываем расстояние до каждого соседнего города
        cityNeighbors.forEach(item => {
            // Расстояние от города до цели
            const distanceToThatCity = shortcut.find(e => e.id === target).distance;

            // Этот город в массиве shortcut
            const thatCity = shortcut.find(e => e.id === item.src_city_id);

            // Записываем расстояние до города если оно меньше чем было
            thatCity.distance = (item.distance + distanceToThatCity) < thatCity.distance
                ? item.distance + distanceToThatCity
                : thatCity.distance;
        });
        // Помечаем город с которым работали
        const checkedCity = shortcut.find(e => e.id === target);
        checkedCity.is_checked = true;

        // Если все города проверены строим маршрут до цели
        if (!shortcut.some(e => !e.is_checked)) {
            // Находим ближайший город с товаром в наличии
            const cityWithInStock = shortcut.filter(e => e.in_stock > 0)
                .sort((a, b) => a.distance - b.distance)[0];

            // Строим маршрут до цели
            const buildRoute = (city) => {
                // Выходим из функции если дошли до цели
                if (city.id === target_id) {
                    return false;
                }

                let nextCity;
                // Находим соседние города
                const cityNeighbors = distances.filter(e => e.src_city_id === city.id);

                cityNeighbors.forEach(item => {
                    // Если расстояние до соседнего города равно расстоянию из массива shortcut, т.е. кратчайшему
                    if (city.distance - item.distance === shortcut.find(e => e.id === item.dst_city_id).distance) {
                        nextCity = shortcut.find(e => e.id === item.dst_city_id);
                        // Запоминаем эту часть маршрута
                        route.push(item);
                    }
                });
                // Переходим к следующей части маршрута
                buildRoute(nextCity);
            }

            buildRoute(cityWithInStock)

            return false
        }
        // Находим следующий город и узнаем расстояние до него
        const nextPonitIndex = shortcut.indexOf(shortcut.find(e => e.id === target)) + 1;
        findDistance(shortcut[nextPonitIndex].id);
    }

    findDistance(target_id);

    return {
        id: route[0].src_city_id, // id города из которого будет произведена доставка
        distance: shortcut.find(e => e.id === route[0].src_city_id).distance, // расстояние до цели
        route, // маршрут доставки
    }
}

const response = delivery(dataCities, dataDistances, 2);
console.log(response);

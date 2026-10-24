# Figma-референс: Winboost Casino UI

Источник: https://www.figma.com/design/epuBpKzeXNurp2UnuRdWmG/Winboost-Casino---UI--Copy-
fileKey: `epuBpKzeXNurp2UnuRdWmG`

Роль: **логический референс**, не макет для копирования. Берём структуру страниц, набор состояний и поведение компонентов; визуал, тексты и бренд — свои (Nova).

Почти каждый экран в Figma есть в двух ширинах: Desktop 1920 (контент 1320, боковое меню 260) и Mobile 375. Многие — в двух вариантах: **гость** и **залогинен**.

## 1. Страницы Figma → что есть в Nova

| Страница Figma | Node | Что внутри | Nova сейчас |
|---|---|---|---|
| Main Page | `2585:56688` | Лобби: баннер приветственного бонуса, категории, полки игр, последние/топ-выигрыши, провайдеры, промо, Hot/Cold слоты, FAQ; нижний попап-бонус; **UI KIT** | ✅ есть (index.html) |
| Login / Sign Up | `2826:64292` | Вход, ошибка входа, регистрация, сила пароля (3 уровня), дропдауны страны/валюты, забыли пароль, выход (Get out); пошаговая регистрация (шаг 1 → 2 → выбор бонуса) | ❌ нет |
| Promo | `5309:2979` | Список бонусов (табы-фильтры, большие карточки), страница одного бонуса (баннер, «как получить», условия, другие бонусы), попап бонуса | ⚠️ только секция в лобби, `pages/promotions.html` не существует |
| Tournaments | `5374:2975` | Гость: баннер, правила, 2 турнира с таймером и таблицей мест. Залогинен: табы + сетка карточек турниров, «Показать ещё» | ⚠️ только баннер в лобби |
| VIP | `10130:42903` | Привилегии, контакт VIP-менеджера, отзывы | ❌ (ссылка есть, страницы нет) |
| Loyalty | `7529:81996` | Баннер, прогресс до след. уровня, статусы (табы), таблица уровней/наград с пагинацией, FAQ | ⚠️ только дропдаун уровня в шапке |
| Cashback & Rakeback | `10957:13588` | Попапы деталей кэшбэка/рейкбэка (карточки по VIP-уровням), панель «Доступные бонусы», дашборд бонусов (карточки: доступен / прогресс / таймер) | ⚠️ дропдаун наград есть, полноценной панели нет |
| Notifications | `10364:25254` | Боковая панель справа: табы с счётчиком, карточки уведомлений (дата, картинка, текст, CTA), «Показать ещё» | ✅ дропдаун есть, можно довести до панели |
| Quests | `10292:33534` | Таймер сезона, прогресс, сетка карточек квестов (выполнен / текущий / следующий) | ❌ |
| Achievements | `7571:8184` | Табы, ряды карточек достижений (default / completed / «оборот» карточки) | ❌ |
| Shop | `7381:3801` | Баланс монет, табы, карточки товаров (cash / FS), попап выбора кол-ва спинов и ставки | ❌ |
| Lottery | `7493:7901` | Банк, билеты, призы, победители прошлого тиража | ❌ |
| Wheel of Fortune | `10946:52349` | Колесо, прогресс до спина, «как работает», FAQ, условия | ❌ |
| Lootboxes | `5244:16808` | 3 сундука (bronze/silver/gold, закрыт/открыт), шаги, FAQ, попап-рулетка приза | ❌ |
| Bonus Map | `18617:19247` | Карта-маршрут бонусов по дням, попапы шага | ❌ |
| Download App | `19008:4977` | Лендинг PWA + попап-инструкция установки (Android / iOS / Safari) | ❌ |
| 404 / 403 | `10464:10116` | Страницы ошибок с CTA «на главную» | ❌ |
| Banners / Mail Template / Logo | — | Баннеры, e-mail шаблон, логотипы | — (вне прототипа) |

**В Figma нет** (придётся проектировать самим): кабинет игрока (профиль, верификация, настройки), касса (депозит/вывод, история транзакций), страница игры (iframe, demo/real), страница провайдера, результаты поиска, ответственная игра/лимиты.

## 2. UI Kit (Main Page → section `3282:88241`)

Полезные компоненты и их состояния:

- **Кнопки**: CTA 1 / CTA 2 / CTA Special / Shop / View All / Arrow / Close / Show (More/Next/Prev) / Go Up / Filter / Social — у всех Default · Hover · Inactive(Disabled), desktop + mobile.
- **Поля формы** `field`: Default · Hover · Active · Valid · Error Empty · Error Filled, для пароля ещё Show/Hidden. Плюс `dropdown-field` (Default · Hover · Opened), `Checkbox` (Default · Hover · Checked), `Icon show password`.
- **Пароль**: `password protection level` (Empty · Bad · Medium · Good) + `Password strength info`.
- **Регистрация**: `Choose bonus` (Default · Chosen), `Point 2` (шаг Done/Not done), `Check Circle`.
- **Навигация**: Header (гость/залогинен × desktop/mobile), Side Menu (Opened/Closed), пункт меню (Default/Dropdown/Sub × Default/Hover/Active), Categories Menu, bottom menu (mobile), `menu-bar` (Current/Hover/Default).
- **Игры**: Game Square (No tag · Tag · Hover), Game tag (New · Hot · High RTP · Bonus Buy), play button, Provider Card, hot/cold slots item.
- **Рейтинги/таблицы**: Place block (Top · Place · My place), Place Icon 1/2/3, Element-Rating Position (Bronze/Silver/Gold; Completed/Current/Next), winner-table, Winner Element.
- **Бонусы/прогресс**: bonus card и bonus card horizontal (Available · Progress · Timer), progress card (уровни 1–5 + Current), progress bar (empty/default/full), timer, Ranks (Bronze…Prime VIP).
- **Промо-механики**: Tournament card/Block, welcome bonus large/small, Promotion Card, Shop card (CASH · FS), Achievement card (Default · Completed · Back), Cards квестов (Default · Complete · Next), Ticket (Default · Super Price), chests, Wheel / Wheel Segments, roulette.
- **Прочее**: FAQ Element (Default · Hover · Opened), Message Popup (тост), scroll-индикатор, иконки (3 набора × 64), цветные иконки разделов (31).

## 3. Паттерны, которые стоит перенять

1. **Гость vs залогинен** — один и тот же раздел в двух состояниях (Promo, Tournaments, Lottery, Loyalty). У Nova сейчас только залогиненное.
2. **Авторизация модалкой** поверх размытого сайта, а не отдельной страницей. Мобайл — полноэкранный контейнер.
3. **Регистрация в 2 шага + выбор бонуса**; сила пароля и ошибки — инлайн под полем.
4. **Шаблон промо-страницы**: баннер → описание → «как получить» (нумерованный список) → CTA → условия (аккордеон) → похожие бонусы. Его же повторяют Lootboxes, Wheel, Download App.
5. **Детали бонуса — модалкой** (Cashback/Rakeback/Promo popup), а не переходом.
6. **Списки** — табы-фильтры сверху + «Показать ещё» внизу (мобайл) / пагинация.
7. **Тост** (Message Popup) для подтверждений вроде «письмо отправлено».

## 4. Предлагаемый порядок для Nova

1. Гостевое состояние шапки + модалки Login / Sign Up / Forgot / Logout со всеми состояниями полей.
2. Касса (депозит/вывод) и кабинет — в Figma нет, проектируем по стилю Nova.
3. Promotions (список + страница бонуса + попап) и Tournaments (список + страница турнира).
4. VIP + Loyalty, панель бонусов (cashback/rakeback).
5. 404/403, Download App.
6. Опционально: Quests, Achievements, Shop, Wheel, Lootboxes, Lottery, Bonus Map.

## Как читать файл

Figma MCP: `get_metadata(fileKey, nodeId)` — структура; `get_screenshot` — картинка; `get_design_context` — детали для вёрстки. Node id страниц — в таблице выше.

# NOVA Casino — состояние проекта

Память о ходе разработки. Обновляется после каждого крупного этапа.

_Последнее обновление: 25.10.2026 — информационные страницы футера (About us, Responsible gaming, Careers, FAQ, Contact us, Terms & Conditions, Privacy policy, Fair play). Ранее — баннеры Tournaments и Promotions по Figma (таймер D/H/M), заголовок и FAQ на VIP Club. Ранее — страницы Promotions (`/promotions`), Tournaments (`/tournaments`), Loyalty Club (`/vip`). Ранее — страница Settings (`/account/settings`), Game history убран из кабинета. Ранее — страница Bonuses (`/account/bonuses`). Ранее — страница Wallet (`/account/wallet`). Ранее — страница My profile (`/account/profile`) и общий каркас кабинета. Ранее — виджет поддержки (Support в боковом меню). Ранее — страница Recently Played (`/recently-played`) и полка «Continue Playing» на Lobby. Ранее — страница Favorites и общее избранное (sessionStorage), фавикон сайта (`public/favicon.*`, `apple-touch-icon.png`). Ранее — страницы категорий и провайдеров (Lobby, Top/New/Live/Table Games, Roulette, Game Shows, /providers/:provider). Ранее — страница игры (`/game/:slug`) с демо Gates of Olympus, States по страницам. Ранее — главная утверждена и выложена: состояния, модалки аккаунта, пополнение, 404, панель States._

## Стек

- Vite 8 + React 19 + React Router 7, одно приложение на все страницы.
- Деплой: GitHub Actions → GitHub Pages (`.github/workflows/deploy.yml`), база `/nova-casino/`.
- Брейкпоинты: мобильный ≤680, планшет 681–1279, десктоп ≥1280 (`src/hooks/useMediaQuery.js`).

## Страницы

| Страница | Маршрут | Статус |
|---|---|---|
| Главная (лобби) | `/` | Готова, перенесена на React без визуальных изменений |
| Страница игры | `/game/:slug` | Готова (прототип): окно игры, полный экран, избранное, Deposit, детали, похожие игры |
| Категории | `/lobby`, `/top-games`, `/new-games`, `/live-games`, `/table-games`, `/roulette`, `/game-shows` | Готовы (прототип): полоса категорий, заголовок с иконкой, сетка игр, Show More |
| Провайдеры | `/providers/:provider` (pragmatic, truelab, playson, netgame, evolution, bgaming, 1spin4win) | Готовы (прототип): как Lobby, заголовок — имя и логотип провайдера |
| Избранное | `/favorites` | Готова (прототип): заголовок с сердечком, Clear All с подтверждением, сетка каталога, пустое состояние с Explore Games |
| Recently Played | `/recently-played` | Готова (прототип): заголовок с часами, Clear History с подтверждением, сетка каталога, пусто → All Games, гость → Log In |
| 404 | любой неизвестный адрес | Готова |
| Виджет поддержки | Support в боковом меню (панель поверх любой страницы) | Готов (прототип): Home, Messages (демо-диалог), Help (категории, поиск, статьи) |
| My profile | `/account/profile` (`/account` → сюда) | Готова (прототип): карточка игрока, уровень, верификация, личные данные с редактированием |
| Wallet | `/account/wallet?tab=deposit\|withdraw\|transactions` | Готова (прототип): обзор баланса, Deposit, Withdraw, Transactions |
| Bonuses | `/account/bonuses?tab=available\|active\|history` | Готова (прототип): активный бонус, промокод, Available / Active / History, условия |
| Settings | `/account/settings` | Готова (прототип): Preferences, Notifications, Security, Responsible gaming, Account |
| Promotions | `/promotions` | Готова (прототип): фильтры All/Welcome/Reload/Special, 6 карточек, детали акции на месте (шаги, условия Show more/less), Get bonus → Bonuses / вход |
| Tournaments | `/tournaments` | Готова (прототип): фильтры All/Daily/Weekly/Monthly, 3 баннера с таймером, See details / Hide: участники, условия, Explore games → All Games, лидерборд на 5 |
| Loyalty Club | `/vip` (VIP Club в меню) | Готова (прототип): баннер, 5 статусов Bronze–Diamond (SVG-медали), таблица уровней по 10 (до 50), FAQ |
| Страницы футера | `/about`, `/responsible-gaming`, `/careers`, `/faq`, `/contact`, `/terms`, `/privacy`, `/fair-play` | Готовы (прототип): общий шаблон `InfoPage`, тексты демо; Careers — Apply-заглушки; Contact — Copy email, Open support, соцсети; FAQ — раскрывающиеся блоки |

## Компоненты

Общий каркас (`src/components/layout`): `AppLayout` (шапка, сайдбар/выдвижное меню, футер, нижняя панель), `Header`, `Sidebar`, `Footer`, `AccountDock`, `AmbientVideo`, `ErrorBoundary` (экран «Something went wrong»).

Шапка (`src/components/header`): `HeaderSearch`, `CurrencySelect`, `DepositButton`, `PlayerLevel` (с наградами), `Notifications`, `ProfileMenu`, `GuestActions` (Log in / Sign up).

Аккаунт (`src/components/auth`): `AuthModal` — вход, регистрация в 2 шага, сброс пароля, подтверждение выхода.

Переиспользуемые (`src/components/ui`): `GameCard`, `SectionHead`/`SectionTitle`, `RotatingStage`, `ScrollIndicator`, иконки `icons.jsx`, а также новые на токенах: `Modal`, `Button`, поля (`TextField`, `PasswordField`, `Checkbox`, `SelectField`), `StateMessage` (ошибка/пусто), `Skeleton`.

Страница игры (`src/pages/game`): `GamePage` (крошки «Home / категория / игра», панель с избранным / полным экраном / Deposit, детали, «You may also like» на `GameShelf`), `GameStage` (гость — вход/регистрация; авторизованный — iframe с публичным демо игры под экраном загрузки (ссылки в `demoUrls`, `src/data/games.js`); ошибка загрузки с «Try again»; у игры свой баланс, ставка и Spin), `useFullscreen` (нативный полный экран, иначе фиксированный оверлей), `useGameData`. Стили — `src/styles/pages/game.css`.

Категории и провайдеры (`src/pages/catalog`): `CatalogPage` (полоса категорий `CategoryNav` с текущей категорией, заголовок, сетка `.nv-catalog-grid`, Show More), `useCatalogData`. Наполнение — `src/data/catalog.js`: Lobby = игры всех полок главной вперемешку, кроме Game Shows; категория = игры своей полки; провайдер = Lobby, его игры первыми. Короткие списки повторяются вперёд-назад (1…8, 8…1, 1…8…). Сетка: 8 / 6 / 4 / 3 в ряд, Game Shows — крупные карточки 4 / 3 / 2. Show More добавляет 24 карточки (Game Shows — 12), до 5 раз. Стили — `src/styles/pages/catalog.css`.

Избранное (`src/pages/favorites`): `FavoritesPage` — сетка `.nv-catalog-grid` без полосы категорий, `StateMessage` для пустого состояния, `Modal` (размер `confirm` — компактный и на телефоне) для Clear All. Стили — `src/styles/pages/favorites.css`.

Recently Played (`src/pages/recent`): `RecentPage` — разметка и стили Favorites (`.nv-favorites`) плюс `src/styles/pages/recent.css` (значок-часы `.nv-title-glyph`, одна строка полки на телефоне). `SectionTitle`/`SectionHead` принимают `glyph` — иконку бокового меню вместо картинки.

Поддержка (`src/components/support`): `SupportWidget` (оболочка: справа снизу 380×640 на десктопе и планшете — над нижней панелью; на телефоне на весь видимый экран с учётом клавиатуры и safe area, страница под ней не прокручивается, кнопка States скрыта), `SupportNav` (Home / Messages / Help), `SupportHome` (шапка в 3 слоя: `support-hero-bg/character/shading.webp`), `SupportMessages` (пусто / карточка диалога, `SupportChat` — демо-переписка с одним автоответом), `SupportHelp` (поиск, категории, `SupportCategory`), `SupportArticle` (связанные статьи, оценка), `SupportFrame` (шапка, закрытие, прокрутка с запоминанием позиции). Состояние — `SupportContext` (`sessionStorage`: `nova-support`, `nova-support-scroll`): история экранов по вкладкам, запрос поиска, переписка, черновик, оценки. Тексты — `src/data/support.js` (4 категории × 2 статьи). Стили — `src/styles/components/support.css`. Support — кнопка (`#supportToggle`), повторное нажатие закрывает; Support в футере тоже открывает панель; Escape закрывает, фокус возвращается на кнопку, открывшую панель (если она скрыта — на бургер).

Кабинет (`src/components/account`): `AccountLayout` — каркас всех страниц `/account/*`: заголовок с иконкой текущего раздела и вкладки `AccountNav` (My profile, Wallet, Bonuses, Settings; раздела Game history на сайте не будет; на телефоне полоса вкладок прокручивается внутри себя). Гость видит «Log In to See Your Account». Разделы — `accountSections` в `src/data/account.js` (из них же меню аватара): `live: true` — есть страница, иначе тост «coming soon». Новая страница кабинета = дочерний маршрут `account` в `App.jsx` + `live: true`. Общие стили кабинета (`.nv-panel`, `.nv-badge`, `.nv-avatar`) — `src/styles/components/account.css`.

My profile (`src/pages/profile`): `ProfilePage` (загрузка — скелетоны, ошибка — «Try again»), `PlayerCard` (аватар, выбор аватара, nickname, Player ID с копированием, дата регистрации, статус), `LevelCard` (уровень и XP из `PlayerContext`, «View bonuses»), `Verification` (статусы Not verified / Pending / Verified / Rejected, окно с шагами и выбором файла — файл не отправляется и не сохраняется), `PersonalInfo` (просмотр / редактирование, проверка полей, Save changes / Cancel; email и телефон — только статус подтверждения). Десктоп (контейнер ≥860px): узкая колонка + форма; иначе одна колонка. Стили — `src/styles/pages/profile.css`.

Wallet (`src/pages/wallet`): `WalletPage` (вкладки из адреса `?tab=`, загрузка / ошибка), `BalanceOverview` (выбор валюты = переключатель в шапке; Real balance, Bonus balance, Available to withdraw = Real − Pending, Pending withdrawals), `DepositTab` (Crypto: валюта, сеть, сумма → демо-адрес `DEMO-ONLY-…` с копированием и предупреждением о сети → «I’ve sent the payment»; Bank card: сумма → имитация страницы провайдера SecurePay без данных карты → Pay; успех / ошибка), `WithdrawTab` (только Verified, иначе переход к `/account/profile#verification`; способ, сеть, адрес или IBAN, сумма с Max, комиссия, итог, срок → экран проверки → Pending, сумма резервируется), `TransactionsTab` (фильтры тип / статус / период, сброс, 8 на страницу, детали с копированием ID; на телефоне — карточки), `parts.jsx` (поля и экраны результата). Условия (лимиты, сети, комиссии, сроки) — `src/data/wallet.js`. Стили — `src/styles/pages/wallet.css`. Окно пополнения (`DepositModal`) остаётся для страницы игры и бонус-баннера; его пополнения тоже пишутся в историю.

Bonuses (`src/pages/bonuses`): `BonusesPage` (вкладки из `?tab=`, загрузка / ошибка / пусто), `ActiveBonus` (денежный: бонусный баланс, срок, макс. ставка, отыгрыш «сумма / цель · %» с базой «N× бонус = цель»; free spins: осталось / всего; View terms, Eligible games, Cancel bonus), `PromoCode`, `BonusModals` (условия, подходящие игры, отмена с перечнем потерь, «уже есть активный бонус»), `terms.js` (единые условия для карточек и деталей). Предложения, промокоды, стартовые бонусы — `src/data/bonuses.js`. Стили — `src/styles/pages/bonuses.css`. Правила: один активный денежный бонус (второй не заменяет первый — объяснение), награда получается один раз, депозитный бонус включается только депозитом (галочка в Wallet → Deposit, `?bonus=deposit100`, или в окне пополнения). Промокод `NOVA25` — 25 free spins в Sweet Bonanza 1000, один раз.

Settings (`src/pages/settings`): `SettingsPage` (загрузка / ошибка, `#rg` и др. — прокрутка к карточке), `Preferences` (язык — только English, без фиктивного выбора; валюта по умолчанию — форма Save changes / Cancel, выбирает кошелёк при открытии сайта, без конвертации; Reduced motion — сразу, системная настройка имеет приоритет), `NotificationSettings` (email по темам, Account & security обязательна), `Security` + `SecurityModals` (смена пароля — демо: проверки, показ/скрытие, ничего не сохраняется; 2FA — демо с тестовым кодом `123456`, узор вместо QR без секрета; активные сессии: текущая + 2 демо, End / End all others), `ResponsibleGaming` (лимит депозита сумма + валюта + Daily/Weekly/Monthly: снижение сразу, повышение / смена валюты / снятие — через 24 ч; Session reminder Off/30/60 — окно `SessionReminder`; Take a break 24h/7d/30d; Self-exclusion 6m/1y/3y/5y с подтверждением), `AccountSettings` (Log out — общее подтверждение выхода; запрос закрытия аккаунта со статусом Requested, данные не удаляются), `parts.jsx` (`SettingsCard`, `SettingRow`, `Switch`, `Segmented`, `DemoTag`). Стили — `src/styles/pages/settings.css`. Состояние — `SettingsContext` (`localStorage` `nova-settings`, только несекретное). Ограничения по сайту: перерыв / самоисключение (`RestrictionNotice`) блокируют окно игры, Wallet → Deposit и окно пополнения; профиль, история, вывод и поддержка доступны. Лимит депозита проверяется в Wallet → Deposit и окне пополнения (`useDepositGuard`, скользящий период, только в валюте лимита). Reduced motion — класс `nv-reduce-motion` на `<html>`: гасит CSS-анимации, останавливает фон-видео, автопрокрутку баннеров и `RotatingStage`. Кнопки `nv-btn--danger*` перенесены в `controls.css`.

Promotions / Tournaments / Loyalty Club (`src/pages/promotions`, `tournaments`, `loyalty`): данные — `src/data/promotions.js`, стили — `src/styles/pages/promotions.css`. Баннеры — общий `HeroBanner` (`src/components/ui`): статичный слайд из дизайнов главной (без коробок, персонаж и свечение сдвинуты), текст передаёт страница. `PageTitle` и `Filters` экспортируются из `PromotionsPage.jsx`. Статусы — `StatusBadge` (SVG). States на этих страницах — только гость / авторизован. Без механики участия, XP и наград.

Страницы футера (`src/pages/info`): `InfoPage` — один шаблон (заголовок, вводный блок, секции: текст, списки, карточки, акцентные блоки, FAQ, контакты), тексты — `src/data/info.js`, стили — `src/styles/pages/info.css`. Ссылки — `footerColumns` в `src/data/navigation.js`; States — только гость / авторизован.

Общие (`src/components/ui`): `FaqList` (раскрывающиеся вопросы, как в FAQ главной), `Avatar` (фото или инициалы на градиенте), `CategoryNav` — полоса категорий главной и страниц категорий.

Главная (`src/pages/home`): `HeroSection`, `RightRail`, `GameShelf`, `PromoGrid`, `ProvidersTicker`, `ActivityTable`, `BonusBanner`, `FaqSection`.

Состояние: `ToastContext` (всплывающие сообщения), `AuthContext` (сессия, открытая модалка, `useAccountAction` — действия только для авторизованных), `PlayerContext` (валюта, кошелёк, уведомления, награды, избранное; кошелёк — реальный и бонусный баланс по валютам и история операций в `localStorage` `nova-wallet`, без реквизитов; `deposit` с id — повторный вызов не зачисляет дважды; `requestWithdrawal` — Pending, резерв; `recordFailure` — Failed, баланс не меняется; бонусы — `localStorage` `nova-bonuses`: записи бонусов, полученные награды уровня, использованные промокоды; Bonus balance в Wallet = активный денежный бонус; счётчик на сундуке в шапке = неполученные награды уровня), `ProfileContext` (демопользователь: личные данные, аватар, статус верификации; `localStorage` `nova-profile`, email берётся из сессии; данные — `src/data/profile.js`). Аватар в шапке берётся из профиля.

Данные с «сервера»: `src/lib/api.js` — фейковый API с задержкой 0,7 с (`fetchLobby`, `fetchGame` — неизвестный slug → «Game not found»); `useLobbyData` отдаёт `loading / ready / error`.

Демо-панель (`src/components/demo`): кнопка «States» внизу слева, всегда видна на сайте. Показывает только состояния текущей страницы. Settings: гость/авторизован, данные (обычно / медленно / ошибка), ограничение игры (нет / перерыв 24 ч / самоисключение — действует на всём сайте), применить ожидающий лимит, показать напоминание о сессии, вернуть демо-сессии, сброс настроек; подсказка: `wrongpass` — неверный текущий пароль, `123456` — код 2FA. Bonuses: гость/авторизован, данные (обычно / медленно / ошибка / пусто), отыгрыш активного бонуса (0 / 35 / 90 % / завершить — бонус переходит в реальный баланс), сброс бонусов, подсказка с промокодом. Wallet: гость/авторизован, данные (обычно / медленно / ошибка / нет истории), платежи (успех / ошибка), верификация, сброс кошелька. My profile: гость/авторизован, данные (обычно / медленно / ошибка), верификация (4 статуса — меняет настоящий статус), сброс демопрофиля. Recently Played: гость/авторизован, история (с играми / пусто — меняет настоящую историю). Избранное: гость/авторизован, список (с играми / пусто — меняет настоящее избранное). Категории и провайдеры: гость/авторизован, данные (обычно / медленно / ошибка / пусто). Главная: страница (главная / 404), гость/авторизован, режим данных (обычно / медленно / ошибка / пусто), модалки. Страница игры: гость/авторизован; данные страницы (обычно / медленно / ошибка / нет похожих игр / игра не найдена); окно игры (загружается / не загружается).

Данные (`src/data`): игры, контент лобби, аккаунт, навигация. Всё — демо-данные.

## Что работает

- Навигация по категориям: боковое меню (активный пункт подсвечен), полоса категорий, View All на полках, крошки страницы игры, нижняя панель планшета (Lobby / Top games / Live), карточки провайдеров.

- Баннер-карусель (стрелки, точки, автопрокрутка, свайп на мобильном).
- Полки игр: стрелки на десктопе, прокручиваемая сетка на планшете и мобильном.
- Поиск по играм, провайдерам и категориям (EN/RU), навигация стрелками.
- Выбор валюты, уведомления (прочитать / прочитать все), меню профиля. Сундук наград у XP открывает панель Level Rewards; Get Bonus и View all bonuses в ней ведут в Bonuses → Available (получение наград — там).
- Избранное (сердечко): одно состояние в `PlayerContext` (`favorites` — slug игр, новые первыми; `isFavorite`, `toggleFavorite`, `clearFavorites`). Хранится в `sessionStorage` (`nova-favorites`): переживает переходы и обновление, новая вкладка — пусто. Повторное добавление поднимает игру наверх. На странице игры — подсказка «Added to / Removed from Favorites» под сердечком (2,5 с), на карточках — общий тост.
- Recently Played: `recent` в `PlayerContext` (`addRecent`, `clearRecent`), `sessionStorage` (`nova-recent`), свежие сверху, без повторов, до 24 игр. Пишется при открытии страницы игры, только у авторизованного. На Lobby у авторизованного с историей — полка «Continue Playing» перед Top Games (каждая игра один раз, View All → Recently Played).
- Таблица активности с вкладками, турниры с таймером, лента победителей, бонус-баннер.
- Выдвижное меню на планшете и мобильном, нижняя панель кошелька на мобильном.
- Учёт `prefers-reduced-motion`.
- Гость: в шапке Log in / Sign up высотой с поиск (на мобильном — компактные, поиск справа, нижней панели нет); Play, сердечко, Deposit, Join now и т. п. открывают вход или регистрацию.
- Вход, регистрация (аккаунт → бонус и согласие 18+), сброс пароля, выход — с проверкой полей и ошибками сервера. Сессия хранится в `localStorage`.
- Тестовые значения: пароль `wrongpass` — ошибка входа, email `taken@nova.casino` — email занят.
- Deposit в шапке и плюс в нижней панели открывают Wallet на вкладке Deposit. Окно пополнения («Deposit now» в бонус-баннере, Deposit на странице игры): валюта, сумма, способ оплаты (крипта — адрес для перевода; карта — поля карты; Skrill/Neteller), бонус 100%, чек с новым балансом. Баланс обновляется. Карта `4000 0000 0000 0002` — отказ банка.
- Скелетоны полок и таблицы активности при загрузке, сообщения «ошибка / пусто» с «Try again», пустые уведомления, страница 404.

## Заглушки

- Play на карточках и выбор игры в поиске открывают `/game/:slug` (гость с карточки — окно входа; по прямой ссылке гость видит экран «Log in to play»).
- Join now, кнопки промо и бонусов — показывают сообщение «будет подключено позже».
- Ссылки футера Resources ведут на старые якоря. Apply в Careers — сообщение «Applications will open soon». Соцсети — без адресов.
- Вход/регистрация — без настоящего сервера: любые корректные данные принимаются.
- Демо подключены у 7 игр: Gates of Olympus, Sugar Rush 1000, Big Bass Bonanza, Wolf Gold, Wild West Gold, Sweet Bonanza 1000 (Pragmatic Play), Book of Dead (Play’n GO). У остальных (лайв, Hacksaw, NetEnt и др.) открытого демо нет — окно пробует загрузиться и показывает ошибку. Демо не связаны с нашим балансом; RTP, волатильность и т. п. — сгенерированные демо-цифры.
- Баланс, уровень, история ставок — демо-данные (одинаковые для всех аккаунтов).
- Ссылки Terms / Privacy в регистрации. Смена email и телефона в профиле — только через Support (текст-подсказка).

## Нерешённые вопросы

- Стили главной перенесены как есть (`src/styles/legacy`, ~140 КБ с многослойными переопределениями). Новые компоненты пишутся на токенах (`src/styles/tokens.css`); старые стили разбираются по компонентам постепенно.
- После слияния в `main` нужно переключить GitHub Pages на источник «GitHub Actions» (Settings → Pages), иначе сайт не обновится.

## Дальше

1. Доступность: клавиатура, контраст, aria.
2. Разбор legacy-стилей по компонентам.

## Решения

- Логотип в шапке и футере (`Brand` в `Header.jsx`) на всех страницах ведёт на главную.
- Состояние «не найдено» на любой странице — общий `NotFoundPage` (без бокового меню на десктопе, текст и кнопка по центру экрана). Своих вариантов 404 не делаем.
- States: выбранные состояния действуют только на той странице, где их включили; при переходе на другой адрес сбрасываются (`src/lib/demo.js` хранит их вместе с адресом). Сквозное только «гость / авторизован».
- Проект — интерактивный прототип: кнопка «States» остаётся на сайте. Каждая новая страница добавляет в неё свои состояния (загрузка, ошибки, пусто, модалки и т. п.).

- Главную не меняем по Figma: дизайн в Figma отличается, новые блоки и логику оттуда на главную не переносим. Figma (`docs/figma-reference.md`) — ориентир только для недостающих частей (модалки, состояния).

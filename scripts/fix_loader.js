const fs = require('fs');
const path = require('path');

// 1. page.tsx
const pagePath = path.join(__dirname, '../src/app/dashboard/page.tsx');
let page = fs.readFileSync(pagePath, 'utf-8');
page = page.replace('{!isDataLoaded && (', '{!isDev && !isDataLoaded && (');
fs.writeFileSync(pagePath, page, 'utf-8');
console.log('page.tsx loader updated');

// 2. UserProvider.tsx
const upPath = path.join(__dirname, '../src/components/providers/UserProvider.tsx');
let up = fs.readFileSync(upPath, 'utf-8');
up = up.replace(
    'const [isDataLoaded, setIsDataLoaded] = useState(false);',
    "const [isDataLoaded, setIsDataLoaded] = useState(process.env.NODE_ENV === 'development');"
);

up = up.replace(
    `case 'INITIAL_SESSION':
                    if (session?.user) {
                        applyUserSession(session.user);
                        refreshDashboardData();
                    } else if (!currentUserRef.current) {
                        setAuthResolved('UNAUTHENTICATED');
                    }`,
    `case 'INITIAL_SESSION':
                    if (session?.user) {
                        applyUserSession(session.user);
                        refreshDashboardData();
                    } else if (process.env.NODE_ENV === 'development') {
                        setAuthResolved('AUTHENTICATED');
                        setIsDataLoaded(true);
                    } else if (!currentUserRef.current) {
                        setAuthResolved('UNAUTHENTICATED');
                    }`
);
fs.writeFileSync(upPath, up, 'utf-8');
console.log('UserProvider.tsx loader updated');

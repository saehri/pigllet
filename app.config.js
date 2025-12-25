const is_dev = process.env.APP_VARIANT === 'development';

export default {
	"expo": {
		"name": is_dev ? "Pigllet (Dev)" : "Pigllet",
		"slug": "pigllet-mobile",
		"version": "2.2.0",
		"orientation": "portrait",
		"description": "Personal finance tracker with budgeting, transactions, and insights",
		"owner": "bahree36",
		"scheme": "myapp",
		"userInterfaceStyle": "automatic",
		"newArchEnabled": true,
		"backgroundColor": "#000000",
		"notification": {
			"color": "#f78565ff",
			"androidMode": "collapse",
			"androidCollapsedTitle": "#{unread_notifications} new notifications"
		},
		"ios": {
			"supportsTablet": false,
			"icon": "./assets/icons/ios-light.png"
		},
		"android": {
			"icon": "./assets/icons/android-icon.png",
			"adaptiveIcon": {
				"foregroundImage": "./assets/icons/adaptive-icon.png",
				"backgroundImage": "./assets/icons/adaptive-icon-background.png"
			},
			"package": is_dev ? "com.bahree36.piglletmobile.dev" : "com.bahree36.piglletmobile"
		},
		"web": {
			"bundler": "metro",
			"output": "single",
			"favicon": "./assets/icons/adaptive-icon.png"
		},
		"plugins": [
			"expo-router",
			"expo-sqlite",
			[
				"expo-splash-screen",
				{
					"backgroundColor": "#ECEDEE",
					"image": "./assets/icons/splash-icon-light.png",
					"dark": {
						"image": "./assets/icons/splash-icon-dark.png",
						"backgroundColor": "#000000"
					},
					"imageWidth": 200
				}
			],
			["expo-image-picker"]
		],
		"experiments": {
			"typedRoutes": true
		},
		"extra": {
			"router": {
				"origin": false
			},
			"eas": {
				"projectId": "9d3984a6-d0cb-493b-8719-055ed18d673a"
			}
		}
	}
}


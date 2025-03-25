module.exports = {
	extends: ['expo', 'prettier'],
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': 'warn',
		'no-unused-vars': 'warn', // No more breaking the build over a missing variable
		'react-hooks/exhaustive-deps': 'warn', // Stop yelling about missing deps in useEffect
		'no-console': 'off', // Let me console.log in peace
	},
};

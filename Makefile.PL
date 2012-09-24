use inc::Module::Install;
all_from '/Users/jun/devel/Adreso/lib/Adreso.pm';

requires 'Nephia' => 0.01;

tests 't/*.t';

test_requires 'Test::More';

WriteAll;

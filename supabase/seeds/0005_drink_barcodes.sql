DO $$
DECLARE
    drink_spaten UUID;
    drink_peroni UUID;
    drink_astra_helles UUID;
    drink_flensburger UUID;
    drink_augustiner_hell UUID;
    drink_holsten_edel UUID;
    drink_smirnoff UUID;
    drink_erdinger_helles UUID;

BEGIN
select id into drink_spaten from drinks where name = 'Spaten';
select id into drink_peroni from drinks where name = 'Peroni';
select id into drink_astra_helles from drinks where name = 'Astra Helles';
select id into drink_flensburger from drinks where name = 'Flensburger';
select id into drink_augustiner_hell from drinks where name = 'Augustiner Hell';
select id into drink_holsten_edel from drinks where name = 'Holsten Edel';
select id into drink_smirnoff from drinks where name = 'Smirnoff';
select id into drink_erdinger_helles from drinks where name = 'Erdinger Helles';


INSERT INTO
    drink_barcodes (drink_id, barcode)
VALUES
    (drink_spaten, '4072700005315'),
    (drink_peroni, '8008696000014'),
    (drink_astra_helles, '42440918'),
    (drink_flensburger, '41030806'),
    (drink_augustiner_hell, '4105250022003'),
    (drink_holsten_edel, '40678214'),
    (drink_smirnoff, '5410316958622'),
    (drink_erdinger_helles, '4005873210040');

END $$;
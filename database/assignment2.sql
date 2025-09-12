-- 1. First insert into 'account' table
INSERT INTO public.account(
	account_firstname, account_lastname, account_email, account_password)
	VALUES ('Tony', 'stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Change 'Tony' account type to 'Admin'
UPDATE public.account
	SET account_type='Admin'
	WHERE account_type='Client';

-- 3. Delete 'Tony' account
DELETE FROM public.account
	WHERE account_id=1;

-- 4. Example of the REPLACE function to update specific words in a string.
UPDATE 
	public.inventory
	
SET
	inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior');

-- 5. inner join to display inventory items with classification name 'Sports'
SELECT
    i.inv_id,
    i.inv_make,
    i.inv_model,
    c.classification_name
FROM public.inventory i
INNER JOIN public.classification c
    ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sports';

-- 6. replacing image paths in inv_image and inv_thumbnail to include 'vehicles' subdirectory
UPDATE 
	public.inventory
	
SET
	inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior');

UPDATE public.inventory
	SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
		inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
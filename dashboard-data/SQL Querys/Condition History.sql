SELECT
    STRNAME,
    SURFACE,
    FEDAID,
    CASE 
        WHEN AS_OF_19 >= 8 THEN 'Good'
        WHEN AS_OF_19 BETWEEN 5 AND 7 THEN 'Fair'
        WHEN AS_OF_19 BETWEEN 0 AND 4 THEN 'Poor'
        ELSE 'No Data'
    END AS COND_2019,
    CASE 
        WHEN AS_OF_21 >= 8 THEN 'Good'
        WHEN AS_OF_21 BETWEEN 5 AND 7 THEN 'Fair'
        WHEN AS_OF_21 BETWEEN 0 AND 4 THEN 'Poor'
        ELSE 'No Data'
    END AS COND_2021,
    CASE 
        WHEN AS_OF_22 >= 8 THEN 'Good'
        WHEN AS_OF_22 BETWEEN 5 AND 7 THEN 'Fair'
        WHEN AS_OF_22 BETWEEN 0 AND 4 THEN 'Poor'
        ELSE 'No Data'
    END AS COND_2022,
    CASE 
        WHEN AS_OF_23 >= 8 THEN 'Good'
        WHEN AS_OF_23 BETWEEN 5 AND 7 THEN 'Fair'
        WHEN AS_OF_23 BETWEEN 0 AND 4 THEN 'Poor'
        ELSE 'No Data'
    END AS COND_2023,
    CASE 
        WHEN AS_OF_24 >= 8 THEN 'Good'
        WHEN AS_OF_24 BETWEEN 5 AND 7 THEN 'Fair'
        WHEN AS_OF_24 BETWEEN 0 AND 4 THEN 'Poor'
        ELSE 'No Data'
    END AS COND_2024,
    CASE 
        WHEN AS_OF_25 >= 8 THEN 'Good'
        WHEN AS_OF_25 BETWEEN 5 AND 7 THEN 'Fair'
        WHEN AS_OF_25 BETWEEN 0 AND 4 THEN 'Poor'
        ELSE 'No Data'
    END AS COND_2025
FROM all_pavement
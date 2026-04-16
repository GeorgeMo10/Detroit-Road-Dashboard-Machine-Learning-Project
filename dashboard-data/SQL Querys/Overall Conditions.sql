WITH Street_Summary AS (
    SELECT
        STRNAME,
        SURFACE,
        CASE 
            WHEN AVG(AS_OF_25) >= 8 THEN 'Good'
            WHEN AVG(AS_OF_25) BETWEEN 5 AND 7 THEN 'Fair'
            ELSE 'Poor'
        END AS Overall_Condition
    FROM all_pavement
    WHERE STRNAME != 'STRNAME'
    GROUP BY STRNAME, SURFACE
)
SELECT 
    SURFACE,
    Overall_Condition,
    COUNT(*) AS Total_Streets
FROM Street_Summary
GROUP BY SURFACE, Overall_Condition
ORDER BY 
    SURFACE,
    CASE 
        WHEN Overall_Condition = 'Good' THEN 1
        WHEN Overall_Condition = 'Fair' THEN 2
        WHEN Overall_Condition = 'Poor' THEN 3
    END;
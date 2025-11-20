package com.universidad.auditorio.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class S3Config {

    @Value("${aws.access.key:${aws_access_key_id:}}")
    private String accessKey;

    @Value("${aws.secret.key:${aws_secret_access_key:}}")
    private String secretKey;
    
    // También leer directamente si están configuradas con guiones bajos
    @Value("${aws_access_key_id:}")
    private String accessKeyAlt;
    
    @Value("${aws_secret_access_key:}")
    private String secretKeyAlt;

    @Value("${aws.s3.region:us-east-1}")
    private String region;

    @Bean
    public AmazonS3 amazonS3() {
        // Usar las credenciales de cualquiera de los dos formatos
        String finalAccessKey = (accessKey != null && !accessKey.isEmpty()) ? accessKey : accessKeyAlt;
        String finalSecretKey = (secretKey != null && !secretKey.isEmpty()) ? secretKey : secretKeyAlt;
        
        // Si no hay credenciales configuradas, retornar null para usar LocalStorageService
        if (finalAccessKey == null || finalAccessKey.isEmpty() || 
            finalSecretKey == null || finalSecretKey.isEmpty()) {
            System.out.println("⚠ AWS S3 no configurado: No se encontraron credenciales");
            return null; // Retorna null si no hay credenciales configuradas
        }
        
        try {
            System.out.println("🔧 Configurando cliente AWS S3...");
            System.out.println("  Access Key: " + finalAccessKey.substring(0, Math.min(10, finalAccessKey.length())) + "...");
            System.out.println("  Region: " + region);
            BasicAWSCredentials awsCredentials = new BasicAWSCredentials(finalAccessKey, finalSecretKey);
            AmazonS3 client = AmazonS3ClientBuilder.standard()
                    .withRegion(region)
                    .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                    .build();
            
            // Verificar que el cliente funciona intentando listar buckets
            System.out.println("✓ Cliente AWS S3 creado exitosamente");
            return client;
        } catch (Exception e) {
            // Si hay error al crear el cliente, retornar null
            System.err.println("✗ Error al crear cliente AWS S3: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}


# Domain-Specific AGI Platform - Terraform Variables

# Environment Configuration
variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

# VPC Configuration
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.20.0/24", "10.0.30.0/24"]
}

# EKS Configuration
variable "kubernetes_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.28"
}

variable "cluster_endpoint_public_access_cidrs" {
  description = "List of CIDR blocks that can access the Amazon EKS public API server endpoint"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "worker_instance_types" {
  description = "Instance types for EKS worker nodes"
  type        = list(string)
  default     = ["t3.large", "t3.xlarge"]
}

variable "worker_desired_size" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 3
}

variable "worker_min_size" {
  description = "Minimum number of worker nodes"
  type        = number
  default     = 1
}

variable "worker_max_size" {
  description = "Maximum number of worker nodes"
  type        = number
  default     = 10
}

# Database Configuration
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.large"
}

variable "db_allocated_storage" {
  description = "Initial storage allocation for RDS"
  type        = number
  default     = 100
}

variable "db_max_allocated_storage" {
  description = "Maximum storage allocation for RDS"
  type        = number
  default     = 1000
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "agi_platform"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "agi_admin"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

# Redis Configuration
variable "redis_node_type" {
  description = "ElastiCache Redis node type"
  type        = string
  default     = "cache.t3.medium"
}

variable "redis_auth_token" {
  description = "Redis AUTH token"
  type        = string
  sensitive   = true
}

# Monitoring Configuration
variable "log_retention_days" {
  description = "CloudWatch log retention period in days"
  type        = number
  default     = 14
}

# Security Configuration
variable "enable_waf" {
  description = "Enable AWS WAF for ALB"
  type        = bool
  default     = true
}

variable "enable_guardduty" {
  description = "Enable AWS GuardDuty"
  type        = bool
  default     = true
}

variable "enable_config" {
  description = "Enable AWS Config"
  type        = bool
  default     = true
}

# Backup Configuration
variable "backup_retention_period" {
  description = "Backup retention period in days"
  type        = number
  default     = 7
}

variable "backup_window" {
  description = "Backup window"
  type        = string
  default     = "03:00-04:00"
}

variable "maintenance_window" {
  description = "Maintenance window"
  type        = string
  default     = "sun:04:00-sun:05:00"
}

# Cost Optimization
variable "enable_spot_instances" {
  description = "Enable spot instances for cost optimization"
  type        = bool
  default     = false
}

variable "spot_instance_interruption_behavior" {
  description = "Spot instance interruption behavior"
  type        = string
  default     = "terminate"
}

# AI/ML Configuration
variable "enable_gpu_nodes" {
  description = "Enable GPU nodes for AI/ML workloads"
  type        = bool
  default     = true
}

variable "gpu_instance_types" {
  description = "GPU instance types for AI/ML workloads"
  type        = list(string)
  default     = ["p3.2xlarge", "p3.8xlarge"]
}

variable "gpu_desired_size" {
  description = "Desired number of GPU nodes"
  type        = number
  default     = 1
}

variable "gpu_min_size" {
  description = "Minimum number of GPU nodes"
  type        = number
  default     = 0
}

variable "gpu_max_size" {
  description = "Maximum number of GPU nodes"
  type        = number
  default     = 5
}

# Data Lake Configuration
variable "data_lake_bucket_versioning" {
  description = "Enable versioning for data lake bucket"
  type        = bool
  default     = true
}

variable "data_lake_lifecycle_rules" {
  description = "S3 lifecycle rules for data lake"
  type = list(object({
    id     = string
    status = string
    transitions = list(object({
      days          = number
      storage_class = string
    }))
  }))
  default = [
    {
      id     = "data_lake_lifecycle"
      status = "Enabled"
      transitions = [
        {
          days          = 30
          storage_class = "STANDARD_IA"
        },
        {
          days          = 90
          storage_class = "GLACIER"
        },
        {
          days          = 365
          storage_class = "DEEP_ARCHIVE"
        }
      ]
    }
  ]
}

# Application Configuration
variable "application_name" {
  description = "Application name"
  type        = string
  default     = "agi-platform"
}

variable "application_version" {
  description = "Application version"
  type        = string
  default     = "1.0.0"
}

# Tagging Configuration
variable "additional_tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}

# Compliance Configuration
variable "compliance_mode" {
  description = "Enable compliance mode (GDPR, PCI-DSS, etc.)"
  type        = bool
  default     = true
}

variable "enable_encryption" {
  description = "Enable encryption at rest and in transit"
  type        = bool
  default     = true
}

variable "enable_audit_logging" {
  description = "Enable comprehensive audit logging"
  type        = bool
  default     = true
}

# Disaster Recovery Configuration
variable "enable_multi_az" {
  description = "Enable multi-AZ deployment"
  type        = bool
  default     = true
}

variable "enable_cross_region_backup" {
  description = "Enable cross-region backup"
  type        = bool
  default     = false
}

variable "dr_region" {
  description = "Disaster recovery region"
  type        = string
  default     = "us-east-1"
}

# Alerting Configuration
variable "enable_slack_alerts" {
  description = "Enable Slack alerts"
  type        = bool
  default     = false
}

variable "slack_webhook_url" {
  description = "Slack webhook URL for alerts"
  type        = string
  default     = ""
  sensitive   = true
}

variable "enable_email_alerts" {
  description = "Enable email alerts"
  type        = bool
  default     = true
}

variable "alert_email_addresses" {
  description = "Email addresses for alerts"
  type        = list(string)
  default     = []
}

# Performance Configuration
variable "enable_enhanced_monitoring" {
  description = "Enable enhanced monitoring"
  type        = bool
  default     = true
}

variable "monitoring_interval" {
  description = "Monitoring interval in seconds"
  type        = number
  default     = 60
}

# Auto Scaling Configuration
variable "enable_cluster_autoscaler" {
  description = "Enable cluster autoscaler"
  type        = bool
  default     = true
}

variable "enable_vertical_pod_autoscaler" {
  description = "Enable vertical pod autoscaler"
  type        = bool
  default     = true
}

variable "enable_horizontal_pod_autoscaler" {
  description = "Enable horizontal pod autoscaler"
  type        = bool
  default     = true
}

# Service Mesh Configuration
variable "enable_service_mesh" {
  description = "Enable service mesh (Linkerd/Istio)"
  type        = bool
  default     = true
}

variable "service_mesh_type" {
  description = "Service mesh type (linkerd or istio)"
  type        = string
  default     = "linkerd"
  
  validation {
    condition     = contains(["linkerd", "istio"], var.service_mesh_type)
    error_message = "Service mesh type must be either 'linkerd' or 'istio'."
  }
}

# AI/ML Model Configuration
variable "enable_model_registry" {
  description = "Enable ML model registry"
  type        = bool
  default     = true
}

variable "enable_feature_store" {
  description = "Enable feature store"
  type        = bool
  default     = true
}

variable "enable_model_monitoring" {
  description = "Enable model monitoring and drift detection"
  type        = bool
  default     = true
}

# Data Processing Configuration
variable "enable_spark_cluster" {
  description = "Enable Apache Spark cluster"
  type        = bool
  default     = true
}

variable "spark_worker_nodes" {
  description = "Number of Spark worker nodes"
  type        = number
  default     = 3
}

variable "spark_worker_instance_type" {
  description = "Instance type for Spark workers"
  type        = string
  default     = "r5.2xlarge"
}

# Message Queue Configuration
variable "enable_kafka" {
  description = "Enable Apache Kafka"
  type        = bool
  default     = true
}

variable "kafka_broker_nodes" {
  description = "Number of Kafka broker nodes"
  type        = number
  default     = 3
}

variable "kafka_instance_type" {
  description = "Instance type for Kafka brokers"
  type        = string
  default     = "kafka.m5.large"
}

# Search Configuration
variable "enable_elasticsearch" {
  description = "Enable Elasticsearch"
  type        = bool
  default     = true
}

variable "elasticsearch_instance_type" {
  description = "Instance type for Elasticsearch"
  type        = string
  default     = "r5.large.elasticsearch"
}

variable "elasticsearch_instance_count" {
  description = "Number of Elasticsearch instances"
  type        = number
  default     = 3
}

# Vector Database Configuration
variable "enable_vector_db" {
  description = "Enable vector database (Pinecone/Milvus)"
  type        = bool
  default     = true
}

variable "vector_db_type" {
  description = "Vector database type (pinecone or milvus)"
  type        = string
  default     = "pinecone"
  
  validation {
    condition     = contains(["pinecone", "milvus"], var.vector_db_type)
    error_message = "Vector database type must be either 'pinecone' or 'milvus'."
  }
}

# External Integrations
variable "enable_hedera_integration" {
  description = "Enable Hedera Hashgraph integration"
  type        = bool
  default     = true
}

variable "hedera_network" {
  description = "Hedera network (testnet or mainnet)"
  type        = string
  default     = "testnet"
}

variable "enable_crm_integration" {
  description = "Enable CRM integration"
  type        = bool
  default     = true
}

variable "crm_systems" {
  description = "List of CRM systems to integrate with"
  type        = list(string)
  default     = ["salesforce", "hubspot"]
}

# Development Configuration
variable "enable_dev_tools" {
  description = "Enable development tools (GitLab, Jenkins, etc.)"
  type        = bool
  default     = false
}

variable "dev_instance_type" {
  description = "Instance type for development tools"
  type        = string
  default     = "t3.large"
}
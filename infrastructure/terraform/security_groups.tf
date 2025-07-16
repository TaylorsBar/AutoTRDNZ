# Domain-Specific AGI Platform - Security Groups

# EKS Cluster Security Group
resource "aws_security_group" "eks_cluster" {
  name        = "${local.cluster_name}-eks-cluster-sg"
  description = "Security group for EKS cluster"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = var.cluster_endpoint_public_access_cidrs
    description = "HTTPS access to EKS API server"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-eks-cluster-sg"
  })
}

# EKS Node Group Security Group
resource "aws_security_group" "eks_nodes" {
  name        = "${local.cluster_name}-eks-nodes-sg"
  description = "Security group for EKS worker nodes"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    self        = true
    description = "Node-to-node communication"
  }

  ingress {
    from_port       = 1025
    to_port         = 65535
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_cluster.id]
    description     = "Control plane to node communication"
  }

  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_cluster.id]
    description     = "Control plane to node HTTPS"
  }

  # Allow SSH access from bastion host (if needed)
  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
    description     = "SSH access from bastion host"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-eks-nodes-sg"
  })
}

# Application Load Balancer Security Group
resource "aws_security_group" "alb" {
  name        = "${local.cluster_name}-alb-sg"
  description = "Security group for Application Load Balancer"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP access"
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS access"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-alb-sg"
  })
}

# RDS Security Group
resource "aws_security_group" "rds" {
  name        = "${local.cluster_name}-rds-sg"
  description = "Security group for RDS database"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
    description     = "PostgreSQL access from EKS nodes"
  }

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
    description     = "PostgreSQL access from bastion host"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-rds-sg"
  })
}

# ElastiCache Redis Security Group
resource "aws_security_group" "redis" {
  name        = "${local.cluster_name}-redis-sg"
  description = "Security group for ElastiCache Redis"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
    description     = "Redis access from EKS nodes"
  }

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
    description     = "Redis access from bastion host"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-redis-sg"
  })
}

# Bastion Host Security Group
resource "aws_security_group" "bastion" {
  name        = "${local.cluster_name}-bastion-sg"
  description = "Security group for bastion host"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Restrict this to your office IP in production
    description = "SSH access"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-bastion-sg"
  })
}

# Kafka Security Group
resource "aws_security_group" "kafka" {
  name        = "${local.cluster_name}-kafka-sg"
  description = "Security group for Kafka cluster"
  vpc_id      = aws_vpc.main.id

  # Kafka broker communication
  ingress {
    from_port   = 9092
    to_port     = 9092
    protocol    = "tcp"
    self        = true
    description = "Kafka broker communication"
  }

  # Kafka broker communication from EKS nodes
  ingress {
    from_port       = 9092
    to_port         = 9092
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
    description     = "Kafka broker access from EKS nodes"
  }

  # Kafka SSL/TLS communication
  ingress {
    from_port   = 9093
    to_port     = 9093
    protocol    = "tcp"
    self        = true
    description = "Kafka SSL/TLS communication"
  }

  # Kafka SSL/TLS communication from EKS nodes
  ingress {
    from_port       = 9093
    to_port         = 9093
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
    description     = "Kafka SSL/TLS access from EKS nodes"
  }

  # Zookeeper communication
  ingress {
    from_port   = 2181
    to_port     = 2181
    protocol    = "tcp"
    self        = true
    description = "Zookeeper communication"
  }

  # Zookeeper follower communication
  ingress {
    from_port   = 2888
    to_port     = 2888
    protocol    = "tcp"
    self        = true
    description = "Zookeeper follower communication"
  }

  # Zookeeper leader election
  ingress {
    from_port   = 3888
    to_port     = 3888
    protocol    = "tcp"
    self        = true
    description = "Zookeeper leader election"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-kafka-sg"
  })
}

# Elasticsearch Security Group
resource "aws_security_group" "elasticsearch" {
  name        = "${local.cluster_name}-elasticsearch-sg"
  description = "Security group for Elasticsearch cluster"
  vpc_id      = aws_vpc.main.id

  # Elasticsearch HTTP
  ingress {
    from_port       = 9200
    to_port         = 9200
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
    description     = "Elasticsearch HTTP access from EKS nodes"
  }

  # Elasticsearch HTTPS
  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
    description     = "Elasticsearch HTTPS access from EKS nodes"
  }

  # Elasticsearch transport
  ingress {
    from_port   = 9300
    to_port     = 9300
    protocol    = "tcp"
    self        = true
    description = "Elasticsearch transport communication"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-elasticsearch-sg"
  })
}

# Spark Security Group
resource "aws_security_group" "spark" {
  name        = "${local.cluster_name}-spark-sg"
  description = "Security group for Spark cluster"
  vpc_id      = aws_vpc.main.id

  # Spark master web UI
  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
    description     = "Spark master web UI"
  }

  # Spark master
  ingress {
    from_port   = 7077
    to_port     = 7077
    protocol    = "tcp"
    self        = true
    description = "Spark master communication"
  }

  # Spark worker web UI
  ingress {
    from_port   = 8081
    to_port     = 8081
    protocol    = "tcp"
    self        = true
    description = "Spark worker web UI"
  }

  # Spark driver
  ingress {
    from_port   = 4040
    to_port     = 4040
    protocol    = "tcp"
    self        = true
    description = "Spark driver web UI"
  }

  # Spark executor communication
  ingress {
    from_port   = 7000
    to_port     = 7999
    protocol    = "tcp"
    self        = true
    description = "Spark executor communication"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-spark-sg"
  })
}

# Vector Database Security Group
resource "aws_security_group" "vector_db" {
  name        = "${local.cluster_name}-vector-db-sg"
  description = "Security group for Vector Database"
  vpc_id      = aws_vpc.main.id

  # Vector DB API
  ingress {
    from_port       = 19530
    to_port         = 19530
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
    description     = "Vector DB API access from EKS nodes"
  }

  # Vector DB gRPC
  ingress {
    from_port       = 19531
    to_port         = 19531
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
    description     = "Vector DB gRPC access from EKS nodes"
  }

  # Vector DB web UI
  ingress {
    from_port       = 9091
    to_port         = 9091
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
    description     = "Vector DB web UI access from EKS nodes"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-vector-db-sg"
  })
}

# Monitoring Security Group
resource "aws_security_group" "monitoring" {
  name        = "${local.cluster_name}-monitoring-sg"
  description = "Security group for monitoring stack"
  vpc_id      = aws_vpc.main.id

  # Prometheus
  ingress {
    from_port       = 9090
    to_port         = 9090
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
    description     = "Prometheus access from EKS nodes"
  }

  # Grafana
  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
    description     = "Grafana access from ALB"
  }

  # Loki
  ingress {
    from_port       = 3100
    to_port         = 3100
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
    description     = "Loki access from EKS nodes"
  }

  # Jaeger
  ingress {
    from_port       = 16686
    to_port         = 16686
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
    description     = "Jaeger UI access from ALB"
  }

  # Jaeger collector
  ingress {
    from_port       = 14268
    to_port         = 14268
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
    description     = "Jaeger collector access from EKS nodes"
  }

  # AlertManager
  ingress {
    from_port       = 9093
    to_port         = 9093
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
    description     = "AlertManager access from EKS nodes"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-monitoring-sg"
  })
}

# AI/ML Services Security Group
resource "aws_security_group" "ai_ml_services" {
  name        = "${local.cluster_name}-ai-ml-services-sg"
  description = "Security group for AI/ML services"
  vpc_id      = aws_vpc.main.id

  # Vision Analysis Service
  ingress {
    from_port       = 8001
    to_port         = 8001
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
    description     = "Vision Analysis Service"
  }

  # NLP Insights Service
  ingress {
    from_port       = 8002
    to_port         = 8002
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
    description     = "NLP Insights Service"
  }

  # Speech Processing Service
  ingress {
    from_port       = 8003
    to_port         = 8003
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
    description     = "Speech Processing Service"
  }

  # Model serving ports
  ingress {
    from_port       = 8000
    to_port         = 8010
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
    description     = "AI/ML model serving ports"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-ai-ml-services-sg"
  })
}

# Output Security Group IDs
output "eks_cluster_security_group_id" {
  description = "ID of EKS cluster security group"
  value       = aws_security_group.eks_cluster.id
}

output "eks_nodes_security_group_id" {
  description = "ID of EKS nodes security group"
  value       = aws_security_group.eks_nodes.id
}

output "alb_security_group_id" {
  description = "ID of ALB security group"
  value       = aws_security_group.alb.id
}

output "rds_security_group_id" {
  description = "ID of RDS security group"
  value       = aws_security_group.rds.id
}

output "redis_security_group_id" {
  description = "ID of Redis security group"
  value       = aws_security_group.redis.id
}

output "kafka_security_group_id" {
  description = "ID of Kafka security group"
  value       = aws_security_group.kafka.id
}

output "monitoring_security_group_id" {
  description = "ID of monitoring security group"
  value       = aws_security_group.monitoring.id
}

output "ai_ml_services_security_group_id" {
  description = "ID of AI/ML services security group"
  value       = aws_security_group.ai_ml_services.id
}
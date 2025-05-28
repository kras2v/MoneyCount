
using AutoMapper;
using MoneyCount.Entities;
using MoneyCount.Models;
using MoneyCount.Models.Authentication;
using MoneyCount.Models.Categories;
using MoneyCount.Models.Transactions;

namespace MoneyCount
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Category, CategoryDTO>().ReverseMap();
            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<User, UpdateUserModel>().ReverseMap();
            CreateMap<User, ViewUserModel>().ReverseMap();
            CreateMap<Transaction, TransactionDTO>().ReverseMap();

            CreateMap<Transaction, TransactionListViewModel>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category));
            CreateMap<TransactionListViewModel, Transaction>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category));

            CreateMap<Transaction, TransactionDetailViewModel>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category));
                
            CreateMap<CreateTransactionModel, Transaction>()
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.CategoryId));
            CreateMap<PutTransactionModel, Transaction>();

            CreateMap<CategoryModel, Category>().ReverseMap();
            CreateMap<CreateCategoryModel, Category>().ReverseMap();
        }
    }
}
